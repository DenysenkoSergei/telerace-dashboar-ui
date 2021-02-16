import React from "react";
import LineGraph from "./LineGraph";


export class DetailsChart extends React.Component {

    render() {
        const { type, chartData, showAggregatedChartValues } = this.props;

        return (
            <div className="d-flex h-100 justify-content-center align-items-center flex-grow-1 details-chart-wrapper">
                <LineGraph
                    showAggregatedChartValues={showAggregatedChartValues}
                    chartData={chartData}
                    id={type}
                />
            </div>
        );
    }

}
