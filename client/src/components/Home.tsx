import React, { useCallback, useEffect, useState } from 'react';
import UserDataQueries from '../classes/userDataQueries';
import {  userStateModel, userDataResponseModel, userLogModel, userDataSchema } from "../types/userData";
import { stateModel }  from "../types/stateModel";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

// Components
import WorkDayTimeline from './WorkDayTimeline';
import WeekDetails from './WeekDetails';
import Footer from "./Footer";

// styles
import styles from "../styles/styles.module.scss";

// Redux 
import { useSelector, useDispatch } from "react-redux";
import { setPrevUserData, setUserData } from '../Actions/userData';

const Home = () => {
    const dispatch = useDispatch();
    const userDataState:userStateModel = useSelector((state:stateModel) => {
        const data = state.userData;
        return data; 
    });
    const userData:userDataSchema = userDataState.userData; 
    const userPrevData:userDataSchema = userDataState.prevUserData; 

    const [ userDataModified, setUserDataModified ] = useState<Array<userLogModel[]>>([]);

    const [ startCount, setStartCount ] = useState(0);
    const [ endCount, setEndCount ] = useState(0);

    const [ hasNextPage, setHasNextPage ] = useState(false);
    const [ hasPrevPage, setHasPrevPage ] = useState(false);
    const [ forward, setForward ] = useState(false);
    
    const [ currentIndex, setCurrentIndex ] = useState(0);
    const [ currentPage, setCurrentPage ] = useState< number | null >(null);

    const [ error, setError ] = useState(false);
    const [ dataNull, setDataNull ] = useState(false);
    const [ nextPageQuerying, setNextPageQuerying ] = useState(true);

    const prevData = async (currentPageParam:number|null, hasNextPageParam:boolean, hasPrevPageParam:boolean) => {
        await UserDataQueries.queryData(currentPageParam, hasNextPageParam, hasPrevPageParam, true).then(res => res.json())
        .then((response:userDataResponseModel) => {
            if (response.error) {
                setError(true);
                return; 
            } else if (response.userData.data.length === 0) {
                setDataNull(true);
                return; 
            }

            const data:any = response.userData; 
            dispatch(setPrevUserData(data.data));

        }).catch(_ => {
            setError(true);
        });
    }

    const queryData = () => {
        setCurrentIndex(0);

        if ( userData.length || error || dataNull) {
            if (!nextPageQuerying) return; 
        }

        UserDataQueries.queryData(currentPage, hasNextPage, hasPrevPage, forward)
            .then(res => res.json())
            .then(async (response:userDataResponseModel) => {
                if (response.error) {
                    setError(true);
                    return; 
                } else if (response.userData.data.length === 0) {
                    setDataNull(true);
                    return; 
                }

                setNextPageQuerying(false);
                const userDataResponse = response.userData.data.reverse();
    
                setHasNextPage(response.hasNextPage ? response.hasNextPage : false);
                setHasPrevPage(response.hasPrevPage ? response.hasPrevPage : false);

                setCurrentPage(response.page ? response.page : null);
                if (response.hasPrevPage && response.page) {
                    await prevData(response.page, hasNextPage, hasPrevPage);
                }

                dispatch(setUserData(userDataResponse));
            }).catch(_ => {
                setError(true);
        });
    }

    const queryUserData = useCallback(() => {
         queryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nextPageQuerying]);

    const updateUserDataModified = useCallback(() => {
        let formattedUserData:Array<userLogModel[]> = [];
            let indexOfSundays:number[] = [];
           
            userData.forEach((dataLog, index) => {
                if (dataLog.startTime) {
                    const day = new Date(dataLog.startTime).getDay();
                    if (day === 6) indexOfSundays.push(index);
                }
            });

            indexOfSundays.forEach((indexOfSunday, index) => {
                let dirivedLog = userData.slice(indexOfSundays[index - 1], indexOfSunday).reverse();
                const dirivedLogStartTime = dirivedLog[dirivedLog.length - 1].startTime; 
                // console.log(index, userPrevData, dirivedLogStartTime, hasPrevPage);
                if (index === 0 && userPrevData.length && dirivedLogStartTime && hasPrevPage) {
                   
                    const dirivedLogDate = new Date(dirivedLogStartTime).getDay();
                    const extraNeeded = 6 - dirivedLogDate;
                    const extraLogs = userPrevData.slice(0, extraNeeded);
                    dirivedLog = dirivedLog.concat(extraLogs);
                }
                formattedUserData.push(dirivedLog);
            });

            
            if (currentPage === 1) {
                const lastLog = [userData.slice(indexOfSundays[indexOfSundays.length - 1]).reverse()];
                formattedUserData = formattedUserData.concat(lastLog);
            }            

            if (forward) setCurrentIndex(formattedUserData.length - 1)
            setUserDataModified(formattedUserData);
    }, [currentPage, forward, hasPrevPage, userData, userPrevData]);

    const updateExtras = useCallback(() => {
        const currentLog = userDataModified[currentIndex];
        if (!currentLog) return; 
        const latestLog = currentLog[currentLog.length - 1];
        if (latestLog?.startTime) {
            const weekDay = new Date(latestLog.startTime).getDay();
            const extraDaysEnd = 6 - weekDay;
            if (extraDaysEnd > 0 || weekDay === 6) setStartCount(extraDaysEnd);
        }

        const oldestLog = currentLog[0];
        if (oldestLog?.startTime) {
            const weekDay = new Date(oldestLog.startTime).getDay();
            setEndCount(weekDay);
        }
    }, [currentIndex, userDataModified]);

    useEffect(updateExtras, [ updateExtras, currentIndex ]);   

    useEffect(queryUserData, [ queryUserData ]);    

    useEffect(updateUserDataModified, [ updateUserDataModified, userPrevData ]);

    const handleBefore = () => {    
        if (currentIndex + 1 < userDataModified.length) {
            setStartCount(0);
            setEndCount(0);
            setCurrentIndex(currentIndex + 1);
        } else if (hasNextPage && currentPage !== null && currentPage > 1) {
            setStartCount(0);
            setEndCount(0);
            setForward(false);
            setNextPageQuerying(true);
        }
    }

    const handleNext = () => {
        if (currentIndex - 1 >= 0) {
            setStartCount(0);
            setEndCount(0);
            setCurrentIndex(currentIndex - 1);
        } else if (hasPrevPage) {
            setStartCount(0);
            setEndCount(0);
            dispatch(setUserData([]));
            setForward(true);
            setNextPageQuerying(true);
        }
    }

    return (
        <React.Fragment>
            <h1 className={styles.header_title}>Driver Console</h1>
            <WorkDayTimeline>
                <React.Fragment>
                    {   
                        endCount ? 
                            userData.length && new Array(endCount).fill(0).map((_, index) => (
                            <WorkDayTimeline.CardNull key={index} data={{}} />
                        )) : null
                    }
                    {
                        userDataModified.length ? userData.length && userDataModified[currentIndex].map((_, index) => {
                            if (!userDataModified[currentIndex][index]) {
                                return null; 
                            }
                            return <WorkDayTimeline.Card key={index} data={userDataModified[currentIndex][index]}/>
                        }) : null
                    }
                    {   
                        startCount ? 
                            userData.length && new Array(startCount).fill(0).map((_, index) => (
                            <WorkDayTimeline.CardNull key={index} data={{}} />
                        )) : null
                    }
                </React.Fragment>
            </WorkDayTimeline>
            <div className={styles.arrowContainer}>
                <div onClick={handleBefore} className={styles.arrowCircle}>
                    <FontAwesomeIcon  className={styles.arrowIconLeft} icon={faChevronLeft} />
                </div>
                <div onClick={handleNext} className={styles.arrowCircle}>
                    <FontAwesomeIcon className={styles.arrowIconRight} icon={faChevronRight} />
                </div>
            </div>
            <WeekDetails data={userDataModified[currentIndex]} />
            <Footer />
        </React.Fragment>
    )
}

export default Home; 