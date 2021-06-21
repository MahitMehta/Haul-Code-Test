import React, { ReactChild, useRef, useEffect } from 'react';
import { userLogModel } from "../types/userData";
import { gsap } from "gsap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from "@fortawesome/free-solid-svg-icons";

// styles
import styles from "../styles/styles.module.scss";
import { ReactFragment } from 'react';

type WorkDayTimelineProps = {
    children: ReactFragment
}

type WorkDayTimelineCard = {
    data: object
}

const MONTHS = ["January", "February", "March", "Abril", "May", "June", "July", "August", "September", "October", "November", "December"];

const WorkDayTimelineContent = ({ children } : WorkDayTimelineProps) => {
    const olRef = useRef<any>(null);
    const olRefContainer = useRef<any>(null);

    useEffect(() => {
        const card:Array<HTMLDivElement> = Array.from(olRef.current.children);
        const cardOne = card[0];

        if (cardOne && olRefContainer.current) {
            const cardWidth = parseInt(window.getComputedStyle(cardOne).width.slice(0, -2));
            const scrollLeftAdjustment = cardWidth * 7;
            olRefContainer.current.scrollLeft = scrollLeftAdjustment;
        }
    });

    return (
        <div ref={olRefContainer}  className={styles.workDayTimelineContainerWrapper}>
            <ol ref={olRef} className={styles.workDayTimelineContainer}>
                { typeof children === "object" && children }
            </ol>
        </div>
    )
}

const WorkDayTimeline = ({ children } : WorkDayTimelineProps ) => {
    const WorkDayTimelineMemo = React.memo(WorkDayTimelineContent);

    return (
        <WorkDayTimelineMemo>
            { children }
        </WorkDayTimelineMemo>
    )
}

const Card = ({ data } : { data:userLogModel }) => {
    const CardRef = useRef(null);

    useEffect(() => {
        gsap.timeline({
            repeat: 0,
            delay: 0.1,
        }).fromTo(CardRef.current, { opacity: 0, scale: 0.75 }, { opacity: 1, scale: 1, duration: 0.25});
    });

    const timeWorkedMS:(number | undefined) = data.dutyStatusDurations?.activeDurationMs;

    let monthFormattedStart:string = "";
    let dayFormattedStart:number = 0;

    let monthFormattedEnd:string = "";
    let dayFormattedEnd:number = 0;

    let hourFormattedStart:number = 0;
    let hourFormattedEnd:number = 0;

    if (data.startTime && data.endTime) {
        const startTimeDate = new Date(data.startTime);
        const endTimeDate = new Date(data.endTime);

        monthFormattedStart = MONTHS[startTimeDate.getMonth()].substring(0, 3);
        dayFormattedStart = startTimeDate.getDate();

        monthFormattedEnd = MONTHS[endTimeDate.getMonth()].substring(0, 3);
        dayFormattedEnd = endTimeDate.getDate();

        hourFormattedStart = startTimeDate.getHours()
        hourFormattedEnd = endTimeDate.getHours()
    }

    let hours:number;
    let minutes:number;
    let weekPayment:number = 0;

    if (timeWorkedMS) {
        hours = Math.floor(timeWorkedMS / 1000 / 60 / 60);
        const remainingMS = timeWorkedMS - (hours * 3.6 * Math.pow(10, 6))
        minutes = remainingMS >= 0 ? Math.floor(remainingMS / 1000 / 60) : 0;
    } else {
        hours = 0;
        minutes = 0;
    }

    if (hours || minutes) {
        const PAY_RATE = 22;
        weekPayment += PAY_RATE * hours;
        weekPayment += Math.round(PAY_RATE * (minutes / 60) * 100) / 100;
    }

    return (
        <div ref={CardRef} style={{ opacity: 0 }} className={styles.weekDayCardContainer}>
            <h4>${weekPayment ? weekPayment : "0.00"}</h4>
            <h1>{hours} H</h1>
            <h2>{minutes} <span>MIN</span></h2>
            <div className={styles.weekDayCardDetails}>
                <h3>{monthFormattedStart}&nbsp;{dayFormattedStart},&nbsp;{hourFormattedStart > 12 ? hourFormattedStart - 12 : hourFormattedStart}&nbsp;
                    <span>{hourFormattedStart > 12 ? "PM" : "AM"}</span>
                </h3>
                <h3 style={{ marginTop: 5 }}>
                    {monthFormattedEnd}&nbsp;{dayFormattedEnd}, {hourFormattedEnd > 12 ? hourFormattedEnd - 12 : hourFormattedEnd }&nbsp;
                    <span>{hourFormattedEnd > 12 ? "PM" : "AM"}</span>
                </h3>
            </div>
        </div>
    )
}

WorkDayTimeline.Card = ({ data } : WorkDayTimelineCard) => {
    const CardMemo = React.memo(Card);
    return <CardMemo data={data} />
}

const CardNull = () => {
    const CardRef = useRef(null);

    useEffect(() => {
        gsap.timeline({
            repeat: 0,
            delay: 0.1,
        }).fromTo(CardRef.current, { opacity: 0, scale: 0.75 }, { opacity: 1, scale: 1, duration: 0.25});
    });

    return (
        <div ref={CardRef} style={{ opacity: 0 }} className={styles.weekDayCardContainer}>
            <FontAwesomeIcon className={styles.clock_icon} icon={faClock} />
        </div>
    )
}

WorkDayTimeline.CardNull = () => {
    return <CardNull />
}


export default WorkDayTimeline;