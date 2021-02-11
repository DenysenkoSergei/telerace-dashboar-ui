import React from "react";
import "../../css/sportsman-details.css"
import {SportsmanMetricBlock} from "./SportsmanMetricBlock";
import {MetricValue} from "./MetricValue";

export class SportsmanDetails extends React.Component {

    constructor(props) {
        super(props);

        this.selectAnotherSportsman = this.selectAnotherSportsman.bind(this);
    }

    render() {
        const {sportsmenList, currentSportsman } = this.props;

        return (
            <div className="d-flex h-100 flex-column justify-content-center sportsman-details">
                <div className="d-flex sportsman-details-header">
                    <div className="current-sportsman d-flex align-items-center justify-content-start">
                        {currentSportsman ? (
                            <div className="d-flex flex-grow-1 align-items-center">
                                <img src='/img/sportsman-photo.png' className="current-sportsman-photo" height="114"
                                     width="114" alt=""/>
                                <div className='current-sportsman-name flex-grow-1 justify-content-center'>
                                    <span>{`${currentSportsman.name} ${currentSportsman.surname}`}</span>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="sportsmen-list-wrapper flex-grow-1 d-flex d-lex flex-column align-items-center">
                        <div className="sportsmen-list-title row justify-content-start">
                            {sportsmenList && sportsmenList.length > 1 ? "Участники сессии:" : null}
                        </div>
                        <div
                            className="d-flex flex-row flex-wrap align-items-start justify-content-start sportsmen-list">
                            {
                                sportsmenList
                                    .filter(sportsmen => sportsmen.id !== currentSportsman.id)
                                    .map((sportsman, index) => (
                                        this.prepareSportsmanItem(sportsman, index)
                                    ))
                            }
                        </div>
                    </div>
                </div>
                {currentSportsman ? (
                    <div className="d-flex h-100 flex-column justify-content-center">
                        <SportsmanMetricBlock bigIconUrl={"/img/heartrate-icon-big.png"}
                                              type="heartrate"
                                              chartData={this.prepareHeartRateChartData(currentSportsman, false)}
                                              metrics={this.prepareHeartRateMetrics(currentSportsman)}/>
                        <SportsmanMetricBlock bigIconUrl={"/img/speed-icon-big.png"}
                                              type="speed"
                                              chartData={this.prepareSpeedChartData(currentSportsman, false)}
                                              metrics={this.prepareSpeedMetrics(currentSportsman)}/>
                        <SportsmanMetricBlock bigIconUrl={"/img/power-icon-big.png"}
                                              type="power"
                                              chartData={this.preparePowerChartData(currentSportsman, true)}
                                              metrics={this.preparePowerMetrics(currentSportsman)}/>
                        <SportsmanMetricBlock bigIconUrl={"/img/cadence-icon-big.png"}
                                              type="cadence"
                                              chartData={this.prepareCadenceChartData(currentSportsman, false)}
                                              metrics={this.prepareCadenceMetrics(currentSportsman)}/>
                        <SportsmanMetricBlock bigIconUrl={"/img/gear-icon-big.png"}
                                              type="gear"
                                              chartData={this.prepareGearChartData(currentSportsman, false)}
                                              metrics={this.prepareGearMetrics(currentSportsman)}/>
                    </div>
                ) : null}

            </div>
        );
    }

    prepareHeartRateMetrics(sportsman) {
        return [
            <MetricValue color="#0EAAFF" key="hr1" type="bpm"
                         value={this.prepareMetricValue(sportsman.heartrate, false)}/>,
            <MetricValue color="#CF1948" key="hr2" type="max"
                         value={this.prepareMetricValue(sportsman.heartrate_max, true)}/>,
            <MetricValue color="#606060" key="hr3" type="avg"
                         value={this.prepareMetricValue(sportsman.heartrate_avg, true)}/>
        ];
    }

    prepareHeartRateChartData(sportsman) {
        return {
            sportsmanId: sportsman.id,
            data: sportsman.heartrate ? sportsman.heartrate : [],
            maxValue: sportsman.heartrate_max ? sportsman.heartrate_max : 0,
            gradientFrom: "#26CEFF",
            gradientTo: "#0EAAFF"
        }
    }

    prepareSpeedMetrics(sportsman) {
        return [
            <MetricValue color="#FFB152" key="sp1" type="km/h"
                         value={this.prepareMetricValue(sportsman.speed, false)}/>,
            <MetricValue color="#CF1948" key="sp2" type="max"
                         value={this.prepareMetricValue(sportsman.speed_max, true)}/>,
            <MetricValue color="#606060" key="sp3" type="avg"
                         value={this.prepareMetricValue(sportsman.speed_avg, true)}/>
        ];
    }

    prepareSpeedChartData(sportsman) {
        return {
            sportsmanId: sportsman.id,
            data: sportsman.speed ? sportsman.speed : [],
            maxValue: sportsman.speed_max ? sportsman.speed_max : 0,
            gradientFrom: "#FFDD52",
            gradientTo: "#FFA452"
        }
    }

    preparePowerMetrics(sportsman) {
        return [
            <MetricValue color="#38DEB4" key="p1" type="w" value={this.prepareMetricValue(sportsman.power, false)}/>,
            <MetricValue color="#CF1948" key="p2" type="max"
                         value={this.prepareMetricValue(sportsman.power_max, true)}/>,
            <MetricValue color="#606060" key="p3" type="avg"
                         value={this.prepareMetricValue(sportsman.power_avg, true)}/>,
            <MetricValue color="#1395D7" key="p4" type="norm"
                         value={this.prepareMetricValue(sportsman.power_norm, true)}/>
        ];
    }

    preparePowerChartData(sportsman, showPowerNorm) {
        return {
            sportsmanId: sportsman.id,
            data: sportsman.power ? sportsman.power : [],
            maxValue: sportsman.power_max ? sportsman.power_max : 0,
            gradientFrom: "#48E5E0",
            gradientTo: "#34DDA9",
            showPowerNorm: showPowerNorm
        }
    }

    prepareCadenceMetrics(sportsman) {
        return [
            <MetricValue color="#FFB152" key="c1" type="rpm"
                         value={this.prepareMetricValue(sportsman.cadence, false)}/>,
            <MetricValue color="#CF1948" key="c2" type="max"
                         value={this.prepareMetricValue(sportsman.cadence_max, true)}/>,
            <MetricValue color="#606060" key="c3" type="avg"
                         value={this.prepareMetricValue(sportsman.cadence_avg, true)}/>
        ];
    }

    prepareCadenceChartData(sportsman) {
        return {
            sportsmanId: sportsman.id,
            data: sportsman.cadence ? sportsman.cadence : [],
            maxValue: sportsman.cadence_max ? sportsman.cadence_max : 0,
            gradientFrom: "#22516F",
            gradientTo: "#71365B"
        }
    }

    prepareGearMetrics(sportsman) {
        return [
            <MetricValue color="#146EB7" key="g1" type="gear"
                         value={this.prepareMetricValue(sportsman.gear_index, false)}/>,
            <MetricValue color="#CF1948" key="g2" type="max"
                         value={this.prepareMetricValue(sportsman.gear_index_max, false)}/>,
            <MetricValue color="#606060" key="g3" type="avg"
                         value={this.prepareMetricValue(sportsman.gear_index_avg, false)}/>
        ];
    }

    prepareGearChartData(sportsman) {
        return {
            sportsmanId: sportsman.id,
            data: sportsman.gear_index ? sportsman.gear_index : [],
            maxValue: 0,
            gradientFrom: "#009CDB",
            gradientTo: "#284487"
        }
    }

    prepareMetricValue(value, isOverridable) {
        if (isOverridable) {
            return value ? value : ' - ';
        } else {
            return value ? value[value.length - 1].split("/")[0] : ' - '
        }
    }

    prepareSportsmanItem(sportsman, index) {
        return (
            <div className="sportsman-list-item row align-items-center" key={index}>
                <img src="/img/sportsman-photo.png" height="35" width="35" alt=""
                     onClick={() => this.selectAnotherSportsman(sportsman)}
                />
                <div className="sportsman-name d-flex align-items-center justify-content-center"
                     onClick={() => this.selectAnotherSportsman(sportsman)}
                >
                    <span>{`${sportsman.name} ${sportsman.surname}`}</span>
                </div>
            </div>
        );
    }

    selectAnotherSportsman(sportsman) {
        localStorage.setItem("currentSportsmanId", sportsman.id);
        this.props.selectSportsman();
    }

}
