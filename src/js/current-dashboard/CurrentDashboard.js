import React from "react";
import {CurrentDashboardCard} from "./CurrentDashboardCard";
import '../../css/current-dashboard.css';

export class CurrentDashboard extends React.Component {

    render() {
        let { sportsmenList, selectSportsman } = this.props;

        return (
            <div className="d-flex h-100 flex-wrap flex-row justify-content-around justify-content-between current-dashboard">
                {
                    sportsmenList.map((sportsman, index) => (
                        <CurrentDashboardCard
                            key={index}
                            sportsman={sportsman}
                            selectSportsman={selectSportsman}
                        />
                    ))
                }

            </div>
        );
    }

}
