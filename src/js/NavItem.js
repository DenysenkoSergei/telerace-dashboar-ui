import React from "react";

const NavItem = props => {
    return props.show
           ? (
               <div onClick={() => props.onClick(props.to)}
                    style={{cursor: "pointer"}}
                    className={"nav-item nav-item-button d-flex justify-content-center align-items-center flex-fill " + props.classNames}>
                   {props.body}
               </div>
           ) : null;
};

export default NavItem;
