import {Link} from "react-router-dom";
import React from "react";

const NavItem = props => {
    return props.show
           ? (
               <Link to={props.to}
                     className={"nav-item nav-item-button d-flex justify-content-center align-items-center flex-fill " + props.classNames}>
                   {props.body}
               </Link>
           ) : null;
};

export default NavItem;
