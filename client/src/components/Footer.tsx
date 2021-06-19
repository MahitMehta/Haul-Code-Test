import React from "react";

// styles
import styles from "../styles/styles.module.scss";


const Footer = () => {
    return (
        <footer className={styles.footer}>
            <a href="https://mahitm.herokuapp.com" target="_blank" rel="noopener noreferrer">
                <h1 className={styles.footer_text}>Mahit Mehta - Copyright © 2021.</h1>
            </a>
        </footer>
    )
}   

export default Footer;