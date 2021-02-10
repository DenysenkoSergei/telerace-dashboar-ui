import React from "react";
import NavItem from "./NavItem";
import '../css/nav.css';

export class Nav extends React.Component {

    render() {
        const { currentLocation } = this.props;

        let sessionButtonButtonClasses = 'margin-left-0 ' + (currentLocation === '/' ? 'gradient-type1' : '');
        let sportsmanDetailsButtonClasses = 'margin-right-0 ' + (currentLocation.startsWith('/sportsman-details') ? 'gradient-type4' : '');

        return (
            <div className="nav d-flex h-100 align-items-center justify-content-between">
                <NavItem to='/'
                         body={(<img src='img/nav-session-icon.png' alt=""/>)}
                         classNames={sessionButtonButtonClasses}
                         show={true}/>
                <NavItem to='/current-dashboard'
                         body={(<img src='img/nav-current-dashboard-icon.png' alt=""/>)}
                         classNames={currentLocation.startsWith('/current-dashboard') ? 'gradient-type2': ''}
                         show={true}/>
                <NavItem to='/summary-dashboard'
                         body={(<img src='img/nav-summary-icon.png' alt=""/>)}
                         classNames={currentLocation.startsWith('/summary-dashboard') ? 'gradient-type3' : ''}
                         show={true}/>
                <NavItem to='/sportsman-details'
                         body={(<img src='img/nav-sportsman-details-icon.png' alt=""/>)}
                         classNames={sportsmanDetailsButtonClasses}
                         show={true}/>
            </div>
        );
    }

}
