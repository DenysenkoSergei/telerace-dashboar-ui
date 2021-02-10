import React from "react";
import LineGraph from "./LineGraph";


export class DetailsChart extends React.Component {

    render() {
        const { type, chartData } = this.props;

        console.log("session update");

        return (
            <div className="d-flex h-100 justify-content-center align-items-center flex-grow-1 details-chart-wrapper">
                <LineGraph
                    chartData={chartData}
                    id={type}
                />
            </div>
        );
    }

}
