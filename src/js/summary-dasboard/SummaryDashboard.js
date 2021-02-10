import React from "react";
import {SummaryDashboardTableRow} from "./SummaryDasboardTableRow";
import "../../css/summary-dashboard.css";

export class SummaryDashboard extends React.Component {

    render() {
        const {sportsmenList} = this.props;

        let maxValues = this.prepareMaxValues(sportsmenList);
        let minValues = this.prepareMinValues(sportsmenList);

        if (!sportsmenList || sportsmenList.length === 0) {
            return null;
        }

        return (
            <div className="d-flex h-100 flex-column align-items-center justify-content-center">
                <div className="table-responsive gradient-type3">
                    <table className="table table-fixed table-summary-dashboard">
                        <thead>
                        <tr>
                            <th scope="col" className="col-3" style={{"border": "none"}}>Имя</th>
                            <th scope="col" className="col-1">BPM avg</th>
                            <th scope="col" className="col-1">BPM max</th>
                            <th scope="col" className="col-1">V avg</th>
                            <th scope="col" className="col-1">V max</th>
                            <th scope="col" className="col-1">P avg</th>
                            <th scope="col" className="col-1">P max</th>
                            <th scope="col" className="col-1">P norm</th>
                            <th scope="col" className="col-2">Gear</th>
                        </tr>
                        </thead>
                        <tbody className="dashboard-scrollbar">
                        {sportsmenList.map((item, index) => (
                            <SummaryDashboardTableRow
                                key={index}
                                sportsmanSummary={item}
                                maxValues={maxValues}
                                minValues={minValues}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    prepareMaxValues(sportsmanList) {
        const fields = ["heartrate_avg", "heartrate_max", "speed_avg", "speed_max", "power_avg", "power_max", "power_norm", "gear_index"];
        let maxValues = {};

        fields.forEach(field => {
            let maxFieldValue = 0;
            if (field === "gear_index") {
                sportsmanList.forEach(sportsman => {
                    if (sportsman[field]) {
                        let value = +(sportsman[field][sportsman[field].length - 1].split("/")[0]);
                        if (value > maxFieldValue) {
                            maxFieldValue = value;
                        }
                    }

                })
            } else {
                sportsmanList.forEach(sportsman => {
                    if (sportsman[field] > maxFieldValue) {
                        maxFieldValue = sportsman[field];
                    }
                })
            }
            maxValues[field] = maxFieldValue;
        })

        return maxValues;
    }

    prepareMinValues(sportsmanList) {
        const fields = ["heartrate_avg", "heartrate_max", "speed_avg", "speed_max", "power_avg", "power_max", "power_norm", "gear_index"];
        let maxValues = {};


        fields.forEach(field => {
            let minFieldValue = Number.MAX_SAFE_INTEGER;

            if (field === "gear_index") {
                sportsmanList.forEach(sportsman => {
                    if (sportsman[field]) {
                        let value = +sportsman[field][sportsman[field].length - 1].split("/")[0];
                        if (value < minFieldValue) {
                            minFieldValue = value;
                        }
                    }

                })
            } else {
                sportsmanList.forEach(sportsman => {
                    if (sportsman[field] < minFieldValue) {
                        minFieldValue = sportsman[field];
                    }
                })
            }

            maxValues[field] = minFieldValue;
        })

        return maxValues;
    }

}
