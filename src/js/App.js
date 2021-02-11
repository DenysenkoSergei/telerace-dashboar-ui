import '../css/App.css';
import "@fontsource/ubuntu"
import React from "react";
import {Header} from "./Header";
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
            sessionSubscribed: false,
            showSession: true,
            showDetails: false,
            showCurrentDashboard: false,
            showSummary: false,
            currentSportsmanId: null
        }

        this.mqttSensorMessageHandler = this.mqttSensorMessageHandler.bind(this);
        this.mqttStatisticMessageHandler = this.mqttStatisticMessageHandler.bind(this);
        this.startSession = this.startSession.bind(this);
        this.stopSession = this.stopSession.bind(this);
        this.extractFromLocalStorage = this.extractFromLocalStorage.bind(this);
        this.onSportsmanChange = this.onSportsmanChange.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.updateState = this.updateState.bind(this);
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

                setInterval(() => this.updateState(), 250);
            }
        });
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        MqttProvider.stopClient();
    }

    render() {
        const {sportsmenList, sessionList, session, showSession, showDetails, showCurrentDashboard, showSummary} = this.state;

        let currentSportsman = this.extractFromLocalStorage();

        return (
            <div className="App container">
                <Header/>
                <Nav showSession={showSession}
                     showDetails={showDetails}
                     showCurrentDashboard={showCurrentDashboard}
                     showSummary={showSummary}
                     onNavClick={this.changeTab}/>

                <div className="app-content">
                    {
                        showSession
                        ? (<Session sportsmenList={sessionList}
                                    allSportsmen={sportsmenList}
                                    session={session}
                                    startSession={this.startSession}
                                    stopSession={this.stopSession}
                                    selectSportsman={this.onSportsmanChange}/>)
                        : null
                    }
                    {
                        showCurrentDashboard
                        ? <CurrentDashboard sportsmenList={sessionList} selectSportsman={this.onSportsmanChange} /> : null
                    }
                    {
                        showSummary
                        ? <SummaryDashboard sportsmenList={sessionList} selectSportsman={this.onSportsmanChange}/> : null
                    }
                    {
                        showDetails
                        ? (<SportsmanDetails selectSportsman={this.onSportsmanChange}
                                             currentSportsman={currentSportsman}
                                             sportsmenList={sessionList}/>)
                        : null
                    }
                </div>
            </div>
        );
    }

    changeTab(val) {
        if (this.state.session) {
            this.setState({
                              showSession: val === 'showSession',
                              showDetails: val === 'showDetails',
                              showCurrentDashboard: val === 'showCurrentDashboard',
                              showSummary: val === 'showSummary'
                          })
        }
    }

    onSportsmanChange() {
        this.changeTab('showDetails');
    }

    extractFromLocalStorage() {
        let currentId = localStorage.getItem("currentSportsmanId");
        if (currentId) {
            return this.state.sportsmenList.filter(sportsman => {return sportsman.id == currentId})[0];
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

                window.location.reload();
            }
        })

    }

    stopSession() {
        localStorage.removeItem("currentSportsmanId");
        SessionProvider.performStopSessionRequest(this.state.session);
        SessionProvider.removeFromLocalstorage();
        MqttProvider.stopClient();
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.setState({
                          session: undefined,
                          sessionList: []
                      });
        window.location.reload();
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

    mqttStatisticMessageHandler(topic, message) {
        const {sessionList} = this.state;
        let parsedMessage = JSON.parse(message.toString());

        sessionList
            .filter(sportsman => sportsman.id == parsedMessage.athlete_id)
            .forEach(sportsman => {
                this.tempData2.push(parsedMessage);
            });
    }

    updateState() {
        const {sessionList} = this.state;
        let dataToProcess = this.tempData;
        this.tempData = [];

        dataToProcess.forEach(parsedMessage => {
            sessionList
                .filter(sportsman => sportsman.id == parsedMessage.athlete_id)
                .forEach(sportsman => {
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
                });
        })

        dataToProcess = this.tempData2;
        this.tempData2 = [];

        dataToProcess.forEach(parsedMessage => {
            sessionList
                .filter(sportsman => sportsman.id == parsedMessage.athlete_id)
                .forEach(sportsman => {
                    Object.keys(parsedMessage)
                        .filter(key => key !== "athlete_id" && key !== "timestamp")
                        .forEach(key => {
                            sportsman[key] = parsedMessage[key];
                        });
                });
        })

        this.setState({sessionList: sessionList})
    }

}

export default App;
