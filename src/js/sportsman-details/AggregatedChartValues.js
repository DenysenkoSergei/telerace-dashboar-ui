import React from "react";

export class AggregatedChartValues extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false
        }

    }

    render() {
        const { hideAggregatedChartValues, hr, speed, power, cadence, gear, timestamp, top, left } = this.props;

        return (
            <div className="d-flex flex-row aggregated-chart-values-wrapper" style={{top: top, left: left}}>
                <div className="d-flex flex-column align-items-start justify-content-start aggregated-chart-values">
                    <div>{timestamp}</div>
                    <div>{hr + " bpm"}</div>
                    <div>{speed + " km/h"}</div>
                    <div>{power + " w"}</div>
                    <div>{cadence + " rpm"}</div>
                    <div>{gear + " gear"}</div>
                </div>
                <div className="d-flex align-items-start justify-content-start" style={{padding: 0}}>
                    <img src="/img/close-icon.png" width={10} height={10} alt="" onClick={hideAggregatedChartValues}
                         style={{cursor: "pointer"}}/>
                </div>
            </div>
        );
    }

}
