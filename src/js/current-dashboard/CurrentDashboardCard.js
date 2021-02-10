import React from "react";
import {CurrentDashboardMetricRecord} from "./CurrentDashboardMetricRecord";
import {Redirect} from "react-router-dom";

export class CurrentDashboardCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            redirectToDetails: false
        }

        this.performRedirectToSportsmanDetails = this.performRedirectToSportsmanDetails.bind(this);
    }

    render() {
        if (this.state.redirectToDetails === true) {
            return <Redirect to='/sportsman-details' />
        }

        const {sportsman} = this.props;

        return (
            <div className="card card-gradient">
                <div className="card-header" onClick={() => this.performRedirectToSportsmanDetails(sportsman.id)}>
                    {`${sportsman.name} ${sportsman.surname}`}
                </div>
                <div className="card-body">
                    <div className="row metrics-group-row">
                        <div className="col-6">
                            <CurrentDashboardMetricRecord
                                iconUrl="img/heartrate-icon.png"
                                value={this.prepareMetricValue(sportsman.heartrate, false)}
                                valueType="bpm"
                            />
                        </div>
                        <div className="col-6">
                            <CurrentDashboardMetricRecord
                                iconUrl="img/speed-icon.png"
                                value={this.prepareMetricValue(sportsman.speed, false)}
                                valueType="km/h"
                                iconColStyle={{left: "-10px", paddingLeft: "0px"}}
                                valueColStyle={{paddingLeft: "0px"}}
                            />
                        </div>
                    </div>
                    <div className="row metrics-group-row">
                        <div className="col-6">
                            <CurrentDashboardMetricRecord
                                iconUrl="img/power-icon.png"
                                value={this.prepareMetricValue(sportsman.power, false)}
                                valueType="w"
                            />
                        </div>
                        <div className="col-6">
                            <CurrentDashboardMetricRecord
                                iconUrl="img/cadence-icon.png"
                                value={this.prepareMetricValue(sportsman.cadence, false)}
                                valueType="rpm"
                                iconColStyle={{"left": "8px", paddingLeft: "0px"}}
                                valueColStyle={{paddingLeft: "0px"}}
                            />
                        </div>
                    </div>
                    <div className="row metrics-group-row justify-content-start">
                        <div className="col-10">
                            <div className='row align-items-center current-dashboard-metric-record'>
                                <div className='col-2 icon-column justify-content-end'>
                                    <img src={"img/gear-icon.png"} alt="" style={{marginLeft: "4px"}}/>
                                </div>
                                <div className='col-10 value-column d-flex justify-content-start align-items-end' style={{marginLeft: "-6px"}}>
                                    <span className='metric-record-value'>{this.prepareMetricValue(sportsman.gear_index, false)}</span>
                                    <span className='metric-record-value-type'>gear</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    prepareMetricValue(value, isOverridable) {
        if (isOverridable) {
            return value ? value : '   - ';
        } else {
            return value ? value[value.length - 1].split("/")[0] : '   -   '
        }
    }

    performRedirectToSportsmanDetails(id) {
        localStorage.setItem("currentSportsmanId", id)
        this.setState({redirectToDetails: true})
    }

}
