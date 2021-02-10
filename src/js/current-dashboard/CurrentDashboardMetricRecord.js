import React from "react";

export class CurrentDashboardMetricRecord extends React.Component {

    render() {
        const {iconUrl, iconColStyle, valueColStyle, value, valueType} = this.props;

        return (
            <div className='row align-items-center current-dashboard-metric-record'>
                <div className='col-3 icon-column justify-content-end' style={iconColStyle}>
                    <img src={iconUrl} alt=""/>
                </div>
                <div className='col-9 value-column d-flex justify-content-start align-items-end' style={valueColStyle}>
                    <span className='metric-record-value'>{value}</span>
                    <span className='metric-record-value-type'>{valueType}</span>
                </div>
            </div>
        );
    }

}
