import '../css/App.css';
import "@fontsource/ubuntu"
import React from "react";
import {Header} from "./Header";
import {Switch, Route, withRouter} from 'react-router-dom';
import {Session} from "./session/Session";
import {Nav} from "./Nav";
import {CurrentDashboard} from "./current-dashboard/CurrentDashboard";
import {SummaryDashboard} from "./summary-dasboard/SummaryDashboard";
import {SportsmanDetails} from "./sportsman-details/SportsmanDetails";
import SportsmanProvider from "./service/SportsmanProvider";
import SessionProvider from "./service/SessionProvider";
import MqttProvider from "./service/MqttProvider";

class App extends React.Component {

    tempData = [];
    tempData2 = [];
    interval = null;

    constructor(props) {
        super(props);

        let session = SessionProvider.getSessionFromLocalstorage();

        this.state = {
            sportsmenList: [],
            sessionList: [],
            session: session,
            sessionSubscribed: false
        }

        this.mqttSensorMessageHandler = this.mqttSensorMessageHandler.bind(this);
        this.mqttStatisticMessageHandler = this.mqttStatisticMessageHandler.bind(this);
        this.startSession = this.startSession.bind(this);
        this.stopSession = this.stopSession.bind(this);
        this.extractFromLocalStorage = this.extractFromLocalStorage.bind(this);
        this.updateState123 = this.updateState123.bind(this);
    }

    componentDidMount() {
        MqttProvider.initMqtt(this.mqttSensorMessageHandler, this.mqttStatisticMessageHandler);
        SportsmanProvider.loadSportsmen((response) => {
            this.setState({sportsmenList: response.data});
            SportsmanProvider.storeSportsmen(response.data);

            let session = SessionProvider.getSessionFromLocalstorage();
            if (session) {
                this.setState({
                                  session: session,
                                  sessionList: this.state.sportsmenList.filter(sportsman => {
                                      return session.session_group.includes(sportsman.id)
                                  })
                              });
                MqttProvider.subscribeToMqtt();
                this.interval = setInterval(() => this.updateState123(), 2000);
            }
        });
    }

    render() {
        const {sportsmenList, sessionList, session} = this.state;

        return (
            <div className="App container">
                <Header/>
                <Nav currentLocation={this.props.location.pathname}/>
                <div className="app-content">
                    <Switch>
                        <Route exact path='/'
                               component={(props) => <Session {...props}
                                                              sportsmenList={sessionList}
                                                              allSportsmen={sportsmenList}
                                                              session={session}
                                                              startSession={this.startSession}
                                                              stopSession={this.stopSession}/>}
                        />
                        <Route path='/current-dashboard'
                               component={(props) => <CurrentDashboard {...props}
                                                                       sportsmenList={sessionList}/>}
                        />
                        <Route path='/summary-dashboard'
                               component={(props) => <SummaryDashboard {...props}
                                                                       sportsmenList={sessionList}/>}
                        />
                        <Route path='/sportsman-details'
                               component={(props) => <SportsmanDetails {...props}
                                                                       currentSportsman={this.extractFromLocalStorage()}
                                                                       sportsmenList={sessionList}/>}
                        />
                    </Switch>
                </div>
            </div>
        );
    }

    extractFromLocalStorage() {
        let currentId = localStorage.getItem("currentSportsmanId");
        if (currentId) {
            return this.state.sportsmenList.filter(sportsman => {
                                                       return sportsman.id == currentId
                                                   }
            )[0];
        } else {
            return null;
        }
    }

    startSession(sessionName, sportsmenIds) {
        let session = {
            "session_start": new Date().toISOString().split('.')[0],
            "session_end": new Date().toISOString().split('.')[0],
            "session_description": sessionName,
            "session_group": sportsmenIds,
            "session_state": "active"
        }
        SessionProvider.createNewSession(session, (response) => {
            if (response.status === 201 || response.status === 200) {
                let createdSession = response.data;
                SessionProvider.storeSession(createdSession);
                if (createdSession.session_group && createdSession.session_group.length > 0) {
                    localStorage.setItem("currentSportsmanId", createdSession.session_group[0]);
                }
                this.setState({
                                  session: createdSession,
                                  sessionList: this.state.sportsmenList.filter(sportsman => {
                                      return createdSession.session_group.includes(sportsman.id)
                                  })
                              });
            }
        })
        MqttProvider.subscribeToMqtt();
        this.interval = setInterval(() => this.updateState123(), 2000);
    }

    stopSession() {
        localStorage.removeItem("currentSportsmanId");
        SessionProvider.performStopSessionRequest(this.state.session);
        SessionProvider.removeFromLocalstorage();
        this.setState({
                          session: undefined,
                          sessionList: []
                      });

        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    mqttSensorMessageHandler(topic, message) {
        const {sessionList} = this.state;

        let parsedMessage = JSON.parse(message.toString());

        sessionList
            .filter(sportsman => sportsman.id == parsedMessage.athlete_id)
            .forEach(sportsman => {
                this.tempData.push(parsedMessage);
            });
    }

    updateState123() {
        const typesToOverride = ["speed_avg", "cadence_avg", "power_avg", "heartrate_avg", "speed_max", "cadence_max",
            "power_max", "heartrate_max", "power_norm"];

        const {sessionList} = this.state;

        this.tempData.forEach(parsedMessage => {
            sessionList
                .filter(sportsman => sportsman.id == parsedMessage.athlete_id)
                .forEach(sportsman => {
                    if (typesToOverride.includes(parsedMessage.data_type)) {
                        sportsman[parsedMessage.data_type] = parsedMessage.value
                    } else {
                        let valuesArr = sportsman[parsedMessage.data_type];

                        if (valuesArr) {
                            let lastValue = valuesArr[valuesArr.length - 1];
                            let totalSum = +lastValue.split("/")[2] * valuesArr.length + parsedMessage.value;
                            let newAvg = totalSum / (valuesArr.length + 1);
                            valuesArr.push(
                                parsedMessage.value + "/" + parsedMessage.timestamp + "/" + newAvg
                            );
                        } else {
                            sportsman[parsedMessage.data_type] = [parsedMessage.value + "/" + parsedMessage.timestamp + "/" + parsedMessage.value];
                        }
                    }
                });
        })

        this.tempData = [];

        this.tempData2.forEach(parsedMessage => {
            sessionList
                .filter(sportsman => sportsman.id == parsedMessage.athlete_id)
                .forEach(sportsman => {
                    Object.keys(parsedMessage)
                        .filter(key => key !== "athlete_id" && key !== "timestamp")
                        .forEach(key => {
                            sportsman[key] = parsedMessage[key];
                        })
                });
        })

        this.tempData2 = [];

        this.setState({sessionList: sessionList});
    }

    mqttStatisticMessageHandler(topic, message) {
        const {sessionList} = this.state;
        let parsedMessage = JSON.parse(message.toString());

        sessionList
            .filter(sportsman => sportsman.id == parsedMessage.athlete_id)
            .forEach(sportsman => {
                Object.keys(parsedMessage)
                    .filter(key => key !== "athlete_id" && key !== "timestamp")
                    .forEach(key => {
                        this.tempData2.push(parsedMessage);
                    })
            });
    }

}

export default withRouter(App);
