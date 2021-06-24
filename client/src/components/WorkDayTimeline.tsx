import React, { ReactChild, useRef, useEffect, useState } from 'react';
import { userLogModel } from "../types/userData";
import { gsap } from "gsap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from "@fortawesome/free-solid-svg-icons";

// styles
import styles from "../styles/styles.module.scss";
import { ReactFragment } from 'react';
import { useCallback } from 'react';

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

const WeekDayCircleJSX = ({ vwOfHours, CIRCLE_RADIUS } : { vwOfHours:string, CIRCLE_RADIUS:string}) => {
    return (
        <svg className={styles.weekDayHoursCircleContainer}>
            <circle className={styles.weekDayHoursCircle} r={CIRCLE_RADIUS} />
            <circle strokeDashoffset={`calc(calc(${2 * Math.PI} * ${CIRCLE_RADIUS} ) - ${vwOfHours})`} 
                    className={styles.weekDayHoursCircleOverlay} r={CIRCLE_RADIUS} />
        </svg>
    )
}

const WeekDayCircle = ({ mobileView, percentageOfHours } : { mobileView:boolean, percentageOfHours:number}) => {
    const WeekDayCircleJSXMemo = React.memo(WeekDayCircleJSX);

    const CIRCLE_RADIUS = mobileView ? "45px" : "4vw";
    const vwOfHours = 2 * Math.PI * parseInt(CIRCLE_RADIUS.slice(0, -2)) * percentageOfHours; 
    const dynamicHours = `${vwOfHours.toString()}${CIRCLE_RADIUS.slice(-2)}`;

    return (
        <WeekDayCircleJSXMemo vwOfHours={dynamicHours} CIRCLE_RADIUS={CIRCLE_RADIUS} />
    )
}

const Card = ({ data } : { data:userLogModel }) => {
    const CardRef = useRef(null);
    const [mobileView, setMobileView] = useState(false);

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

    let timePeriodStart:string = "";
    let timePeriodEnd:string = "";

    if (data.startTime && data.endTime) {
        const startTimeDate = new Date(data.startTime);
        const endTimeDate = new Date(data.endTime);

        const timezone:any = data.driver?.timezone; 
        const startTimeDateLocal = startTimeDate.toLocaleString("en-US", { timeZone: timezone });
        const monthNumStart = parseInt(startTimeDateLocal.split(/[/,]/)[0]) - 1; 

        const dayNumStart = parseInt(startTimeDateLocal.split(/[/,]/)[1]); 
        monthFormattedStart = MONTHS[monthNumStart].substring(0, 3);
        dayFormattedStart = dayNumStart
        hourFormattedStart = parseInt(startTimeDateLocal.split(/[\s:]/)[1]);
        timePeriodStart = startTimeDateLocal.slice(-2); 

        const endTimeDateLocal = endTimeDate.toLocaleString("en-US", { timeZone: timezone });
        const monthNumEnd = parseInt(endTimeDateLocal.split(/[/,]/)[0]) - 1; 

        const dayNumEnd = parseInt(endTimeDateLocal.split(/[/,]/)[1]); 
        monthFormattedEnd = MONTHS[monthNumEnd].substring(0, 3);
        dayFormattedEnd = dayNumEnd;
        hourFormattedEnd = parseInt(endTimeDateLocal.split(/[\s:]/)[1]);

        timePeriodEnd = endTimeDateLocal.slice(-2); 
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

    const totalMinutes = (60 * hours) + (minutes);
    const minutesInDay = 60 * 24; 
    const percentageOfHours = totalMinutes / minutesInDay; 

    const resizeCircle = () => {
        if (window.innerWidth <= 1100 && !mobileView) {
            setMobileView(true);
        } else if (window.innerWidth > 1100 && mobileView) {
            setMobileView(false);
        }
    };
    

    useEffect(() => {
        resizeCircle();

        window.addEventListener('resize', () => {
            resizeCircle();
        });

        return () => {
            setMobileView(window.innerWidth <= 1100);
        }
    });

    return (
        <div ref={CardRef} style={{ opacity: 0 }} className={styles.weekDayCardContainer}>
            <div className={styles.weekDayHours}>
                <WeekDayCircle mobileView={mobileView} percentageOfHours={percentageOfHours} />
                <div className={styles.weekDayHoursAmount}>
                    <h1>{hours} H</h1>
                    <h2>{minutes} <span>MIN</span></h2>
                </div>
            </div>
            <div className={styles.weekDayCardDetails}>
                <h4>${weekPayment ? weekPayment : "0.00"}</h4>
                <h3>{monthFormattedStart}&nbsp;{dayFormattedStart},&nbsp;{hourFormattedStart}&nbsp;
                    <span>{timePeriodStart}</span>
                </h3>
                <h3 style={{ marginTop: 5 }}>
                    {monthFormattedEnd}&nbsp;{dayFormattedEnd}, {hourFormattedEnd }&nbsp;
                    <span>{timePeriodEnd}</span>
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