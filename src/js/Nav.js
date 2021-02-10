import React from "react";
import NavItem from "./NavItem";
import '../css/nav.css';

export class Nav extends React.Component {

    render() {
        const { showSession, showDetails, showCurrentDashboard, showSummary, onNavClick } = this.props;

        let sessionButtonButtonClasses = 'margin-left-0 ' + (showSession ? 'gradient-type1' : '');
        let sportsmanDetailsButtonClasses = 'margin-right-0 ' + (showDetails ? 'gradient-type4' : '');

        return (
            <div className="nav d-flex h-100 align-items-center justify-content-between">
                <NavItem to='showSession'
                         body={(<img src='img/nav-session-icon.png' alt=""/>)}
                         classNames={sessionButtonButtonClasses}
                         onClick={onNavClick}
                         show={true}/>
                <NavItem to="showCurrentDashboard"
                         body={(<img src='img/nav-current-dashboard-icon.png' alt=""/>)}
                         classNames={showCurrentDashboard ? 'gradient-type2': ''}
                         onClick={onNavClick}
                         show={true}/>
                <NavItem to='showSummary'
                         body={(<img src='img/nav-summary-icon.png' alt=""/>)}
                         classNames={showSummary ? 'gradient-type3' : ''}
                         onClick={onNavClick}
                         show={true}/>
                <NavItem to='showDetails'
                         body={(<img src='img/nav-sportsman-details-icon.png' alt=""/>)}
                         classNames={sportsmanDetailsButtonClasses}
                         onClick={onNavClick}
                         show={true}/>
            </div>
        );
    }

}
