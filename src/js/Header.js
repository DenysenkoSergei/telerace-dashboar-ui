import React from "react";
import {Link} from "react-router-dom";
import '../css/header.css';

export class Header extends React.Component {

    render() {
        return (
            <div className="navbar justify-content-between align-content-center header">
                <Link className="navbar-brand" to="/">
                    <img src="img/logo.png" width="277" height="69" alt=""/>
                </Link>

                <div className="d-flex justify-content-around align-content-center">
                    <img className='header-icon general-settings-icon' src="img/general-settings-icon.png" alt=""/>
                    <div className='icon-delimiter'/>
                    <img className='header-icon' src="img/personal-cabinet-icon.png" alt=""/>
                </div>
            </div>
        );
    }

}
