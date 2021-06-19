import { userStateModel } from "../types/userData";

type actionModel = {
    type: (string | null | undefined ),
    data?: any,
}

const defaultState = {
    userData: [],
    prevUserData: [],
}

const userDataReducer = (state:userStateModel = defaultState, action:actionModel) => {
    switch(action.type) {
        case "SET_USER_DATA": {
            const tempState = { ...state };
            tempState.userData = action.data; 
            return tempState;
        }

        case "SET_PREV_USER_DATA": {
            const tempState = { ...state };
            tempState.prevUserData = action.data;
            return tempState;
        }

        default: {
            return state;
        }
    }
}

export default userDataReducer; 