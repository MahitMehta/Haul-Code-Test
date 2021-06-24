import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faTruck, faMoon } from "@fortawesome/free-solid-svg-icons";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../Actions/themeData";
import { themeStateModel, stateModel } from "../types/stateModel";

// styles
import styles from "../styles/styles.module.scss";

type NavbarProps = {
    children: React.ReactChild,
}

const Navbar = ({ children } : NavbarProps ) => {
    const dispatch = useDispatch();
    const themeData:themeStateModel = useSelector((state:stateModel) => state.theme);
    const theme = themeData.theme ? themeData.theme : "light";

    return (
        <nav className={styles.header}>
             <h1 className={styles.header_title}>
                <FontAwesomeIcon className={styles.header_truck_icon} icon={faTruck} />
                 <span style={{ whiteSpace: "nowrap"}}>Driver Console</span></h1>
             <div className={styles.navbar_arrows}>
                 { children }
             </div>
             <div className={styles.navbar_theme_container} onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))} >
                <div className={styles.navbar_theme_slider}
                    style={ theme === "dark" ? 
                        { "transform": "translate(-25%)" } : 
                        { "transform": "translate(25%)" }}
                >
                    <FontAwesomeIcon 
                        style={{ cursor: "pointer", color: "#023047", transform: theme === "dark" ? "rotate(-75deg)" : "rotate(0deg)" }}
                        onClick={() => dispatch(setTheme("dark"))} 
                        className={styles.navbar_icon}
                        icon={faMoon} />
                    <FontAwesomeIcon 
                        style={{ cursor: "pointer", color: "#ffc851", transform: theme === "dark"  ? "rotate(0deg)" : "rotate(-75deg)" }}
                        onClick={() => dispatch(setTheme("light"))} 
                        icon={faSun} />
                </div>
             </div>
        </nav>
    )
}

export default Navbar;