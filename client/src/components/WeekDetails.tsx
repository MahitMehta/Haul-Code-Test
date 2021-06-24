import React from 'react';
import {  userLogModel } from "../types/userData";

// Components
// import Graph from './Graph';
import GraphChartJS from './GraphChartJS';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

// import CanvasJSReact from "canvasjs";

// styles
import styles from "../styles/styles.module.scss";

type DetailProps = {
    value: string,
    detailName: string,
    note?: string,
    warning?: boolean,
    tooltip?: string,
}

type GrossPaymentReturnObj = {
    overtime: boolean,
    totalPay: number,
    totalHours: number,
}

const MAX_HOURS_PER_WEEK = 70;

function calculateGrossPayroll(allData : userLogModel[]) : GrossPaymentReturnObj {
    let totalHours = 0; 

    allData?.forEach(data => {
        const timeWorkedMS:(number | undefined) = data.dutyStatusDurations?.activeDurationMs;
        let hours:number; 
        let minutes:number; 

        if (timeWorkedMS) {
            hours = Math.floor(timeWorkedMS / 1000 / 60 / 60); 
            const remainingMS = timeWorkedMS - (hours * 3.6 * Math.pow(10, 6))
            minutes = remainingMS >= 0 ? Math.floor(remainingMS / 1000 / 60) : 0;
        } else {
            hours = 0;
            minutes = 0; 
        }

        totalHours += hours + (minutes / 60);
    });

    const PAY_RATE = 22
    const OVERTIME_PAY_RATE = 33

    let totalPay = 0; 

    if (totalHours <= 40) {
        totalPay += Math.round((totalHours * PAY_RATE) * 100) / 100;
    } else {
        totalPay += Math.round((40 * PAY_RATE) * 100) / 100;
        totalPay += Math.round(((totalHours - 40) * OVERTIME_PAY_RATE) * 100) / 100;
    }

    const returnObj : GrossPaymentReturnObj = { 
        overtime: totalHours > 40,
        totalPay,
        totalHours: Math.round(totalHours * 100) / 100,
    }

    return returnObj;
}

const Detail = ({ note, value, detailName, warning, tooltip } : DetailProps) => {
    return (
        <div className={styles.detailContainer}>
            <h3 className={styles.detailName}>{detailName}</h3>
            <div className={styles.detail_note}>
                { note && <span 
                    style={warning ? { backgroundColor: "#FF6161", color: "#8A0000"} : {}} className={styles.detailNote}>
                { tooltip && <span className={styles.detail_tooltip}>{ tooltip }</span> }
                {note}</span> }
            </div>
            <h3 className={styles.detailValue}>{value}</h3>
        </div>
    )
}

const WeekDetails = ({ data } : { data: userLogModel[] }) => {
    const grossPaymentObj : GrossPaymentReturnObj = calculateGrossPayroll(data); 
    const { overtime, totalPay, totalHours } = grossPaymentObj;

    const percentage = Math.round((totalHours / MAX_HOURS_PER_WEEK) * 100);

    return (
        <React.Fragment>
            <section className={styles.weekDetailsContainer}>
                <h1>
                    <FontAwesomeIcon icon={faCalendar} className={styles.weekDetailsIcon} />
                    Week Details
                </h1>
                <section className={styles.weekDetails}>
                    <div className={styles.weekDetailsDiv}>
                        <GraphChartJS hourData={data}/>
                        {/* <Graph data={data} /> */}
                    </div>
                    <div className={styles.weekDetailsDivDetails}>
                        <Detail 
                            note={ overtime ? "Overtime Payed" : undefined }
                            value={`Gross Payroll: $${ totalPay }`}
                            detailName="Week Payroll"
                        />
                        <Detail 
                            tooltip="By law, each driver can only work 70 hours within a 7 day period."
                            warning={ totalHours >= MAX_HOURS_PER_WEEK * 0.80 }
                            note={`Completed ${percentage}%`}
                            value={`Hours Worked: ${ totalHours } H`}
                            detailName="Total Hours Worked"
                        />
                    </div>
                </section>
            </section>
        </React.Fragment>
    )
}   

export default WeekDetails;