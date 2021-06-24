export type userStateModel = {
    userData: Array<object>,
    prevUserData: Array<object>
}
 
export type userDataResponseModel = {
    error: boolean,
    userData:  userDataModel,
    hasNextPage?: boolean,
    page?: number, 
    hasPrevPage?: boolean,
}

export type userLogModel = userDataModelLogs

type userDataModelDutyStatus= {
    activeDurationMs: number
    driveDurationMs: number
    offDutyDurationMs: number
    onDutyDurationMs: number
    personalConveyanceDurationMs:number
    sleeperBerthDurationMs: number
    waitingTimeDurationMs: number
    yardMoveDurationMs: number
}

type userDataModelLogs = {
    distanceTraveled?: object
    driver?: { timezone: any },
    startTime?: string,
    endTime?: string,
    logMetaData?: object,
    dutyStatusDurations?: userDataModelDutyStatus
}

type userDataModel = {
    data: userDataModelLogs[],
}

export type userDataSchema = userDataModelLogs[];