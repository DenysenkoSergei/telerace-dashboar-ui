import React from "react";
import "../../css/sportsman-details.css"


export class MetricValue extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentSportsman: this.props.currentSportsman
        }

    }

    render() {
        const { color, value, type } = this.props;

        return (
            <div className="d-flex flex-row justify-content-center align-items-center sportsman-metric" style={{color: color}}>
                <span className="metric-value">{value}</span>
                <span className="metric-type">{type}</span>
            </div>
        );
    }

}
