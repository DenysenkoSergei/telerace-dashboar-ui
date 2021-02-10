import React from "react";
import {Redirect} from "react-router-dom";

export class SummaryDashboardTableRow extends React.Component {

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

        const {sportsmanSummary, maxValues, minValues} = this.props;
        const {name, surname, heartrate_avg, heartrate_max, speed_avg, speed_max, power_avg, power_max, power_norm, gear_index} = sportsmanSummary;

        const prepareColumnClass =
            (field) => this.getClassForValue(sportsmanSummary, maxValues, minValues, field);

        return (
            <tr>
                <td className="col-3"
                    style={{cursor: "pointer"}}
                    onClick={() => this.performRedirectToSportsmanDetails(sportsmanSummary.id)}>
                    {this.prepareFullName(name, surname)}
                </td>
                <td className={"col-1" + prepareColumnClass("heartrate_avg")}>{this.prepareValue(heartrate_avg)}</td>
                <td className={"col-1" + prepareColumnClass("heartrate_max")}>{this.prepareValue(heartrate_max)}</td>
                <td className={"col-1" + prepareColumnClass("speed_avg")}>{this.prepareValue(speed_avg)}</td>
                <td className={"col-1" + prepareColumnClass("speed_max")}>{this.prepareValue(speed_max)}</td>
                <td className={"col-1" + prepareColumnClass("power_avg")}>{this.prepareValue(power_avg)}</td>
                <td className={"col-1" + prepareColumnClass("power_max")}>{this.prepareValue(power_max)}</td>
                <td className={"col-1" + prepareColumnClass("power_norm")}>{this.prepareValue(power_norm)}</td>
                <td className={"col-2" + prepareColumnClass("gear_index")}>{this.prepareValue(gear_index, true)}</td>
            </tr>
        );
    }

    prepareValue(value, isOverridable) {
        if (isOverridable) {
            return value ? value[value.length - 1].split("/")[0] : '-';
        } else {
            return value ? value : '-';
        }
    }

    prepareFullName(firstName, lastName) {
        return firstName && firstName.length > 0 ? firstName[0] + '. ' + lastName : lastName;
    }

    getClassForValue(sportsmanSummary, maxSummary, minSummary, field) {
        if (maxSummary && sportsmanSummary[field] === maxSummary[field]) {
            return " summary-dashboard-td-max-value";
        }

        if (minSummary && sportsmanSummary[field] === minSummary[field]) {
            return " summary-dashboard-td-min-value";
        }

        return "";
    }

    performRedirectToSportsmanDetails(id) {
        localStorage.setItem("currentSportsmanId", id);
        this.setState({redirectToDetails: true})
    }

}
