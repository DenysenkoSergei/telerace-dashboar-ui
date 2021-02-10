import React from "react";
import {CheckboxSelect} from "./CheckboxSelect";
import SessionTimeCounter from "./SessionTimeCounter";
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../../css/session.css';

export class Session extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: [],
            sessionName: "",
            toDetails: false
        };

        this.onSelect = this.onSelect.bind(this);
        this.stopSession = this.stopSession.bind(this);
        this.initiateSessionStop = this.initiateSessionStop.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const {sportsmenList, session, allSportsmen, startSession} = this.props;
        const {sessionName} = this.state;
        const sessionExists = !!session;

        return (
            <div className="d-flex flex-column session-block">
                <div className="row session-header gradient-type1">
                    <div className="col-6 tab-header active-tab-header">Live</div>
                    <div className="col-6 tab-header inactive-tab-header">Архив</div>
                </div>
                {sessionExists ? (
                    <div className="row session-config h-100 d-flex gradient-type1">
                        <div className="col-6 d-flex w-100 flex-column align-items-center">
                            <div
                                className="d-flex justify-content-between align-items-center gradient-type6 active-session-name">
                                <span className="flex-grow-1 text-left">{session.session_description}</span>
                                <img src="/img/ok-icon.png" width={24} height={19} alt=""/>
                            </div>

                            <div
                                className="d-flex flex-column justify-content-center gradient-type6 active-session-sportsmen-wrapper">
                                <div
                                    className="d-flex justify-content-between align-items-center active-session-sportsmen-label">
                                    <span className="flex-grow-1 text-left">Спортсмены</span>
                                    <img src="/img/ok-icon.png" width={24} height={19} alt=""/>
                                </div>
                                <div
                                    className="d-flex flex-wrap justify-content-left align-items-center active-session-sportsmen-list">
                                    {
                                        sportsmenList.map((sportsman, inx) => (
                                            <div key={inx} onClick={() => this.performRedirectToSportsmanDetails(sportsman.id)}
                                                 className="active-session-sportsman">{`${sportsman.name} ${sportsman.surname}`}</div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-6 d-flex align-items-center justify-content-center">
                            <div className="stop-session-block">
                                <div
                                    className="d-flex align-items-center justify-content-center stop-session-button-wrapper">
                                    <img src="/img/stop-session-icon.png" height="75" width="75" alt=""
                                         onClick={this.stopSession}/>
                                </div>
                                <SessionTimeCounter sessionStart={session.session_start}/>
                            </div>
                        </div>
                    </div>
                ) : (
                     <div className="row session-config h-100 gradient-type1">
                         <div className="col-6 d-flex justify-content-center">
                             <input className="session-name-input gradient-type6"
                                    value={sessionName}
                                    onChange={this.handleChange}
                                    onBlur={this.handleChange}
                                    placeholder={"Название сессии |"}/>
                             <CheckboxSelect
                                 classes={"sportsman-select gradient-type6"}
                                 placeholder={"Спортсмены"}
                                 sessionName={sessionName}
                                 selectHandler={this.onSelect}
                                 options={this.prepareOptions(allSportsmen)}
                             />

                         </div>
                         <div className="col-6 d-flex justify-content-center">
                             <div className="stop-session-block d-flex align-items-center justify-content-center">
                                 <div className="d-flex align-items-center justify-content-center stop-session-button-wrapper">
                                     <img src="/img/start-session-img.png" height="75" width="75" alt=""
                                          onClick={() => startSession(this.state.sessionName, this.state.selected)}/>
                                 </div>
                             </div>
                         </div>
                     </div>
                 )}

            </div>
        );
    }

    prepareOptions(sportsmenList) {
        if (sportsmenList) {
            return sportsmenList.map(sportsman => {
                return {
                    id: sportsman.id,
                    name: `${sportsman.name} ${sportsman.surname}`
                }
            })
        } else {
            return [];
        }
    }

    handleChange(event) {
        this.setState({sessionName: event.target.value})
    }


    onSelect(id) {
        let selected = this.state.selected;
        let inx = selected.indexOf(id);
        if (inx < 0) {
            selected.push(id);
        } else {
            selected.splice(inx, 1);
        }

        this.setState({selected: selected})
    }


    stopSession = () => {
        confirmAlert({
                         customUI: ({onClose}) => {
                             return (
                                 <div
                                     className='d-flex flex-column align-items-center justify-content-start session-stop-confirmation'>
                                     <div className="d-flex w-100 flex-row justify-content-end align-content-end"
                                          style={{padding: "12px"}}>
                                         <img src="/img/close-icon.png" width={25} height={25} alt="" onClick={onClose}
                                              style={{cursor: "pointer"}}/>
                                     </div>
                                     <div style={{marginTop: "15px"}}>Завершить сессию?</div>
                                     <div className="d-flex flex-row align-items-center justify-content-center"
                                          style={{marginTop: "90px"}}>
                                         <button className="yes-button gradient-type1" onClick={() => {
                                             this.initiateSessionStop();
                                             onClose();
                                         }}>
                                             Да
                                         </button>
                                         <button className="no-button" onClick={onClose}>Нет</button>
                                     </div>
                                 </div>
                             );
                         }
                     });
    };

    initiateSessionStop() {
        this.props.stopSession();
    }

    performRedirectToSportsmanDetails(id) {
        localStorage.setItem("currentSportsmanId", id);
        this.props.selectSportsman();
    }

}
