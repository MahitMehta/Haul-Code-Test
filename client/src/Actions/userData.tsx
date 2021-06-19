export const setUserData = (data:Array<any>) => (
    {
        type: "SET_USER_DATA",
        data
    }
)

export const setPrevUserData = (data:Array<any>) => (
    {
        type: "SET_PREV_USER_DATA",
        data
    }
)