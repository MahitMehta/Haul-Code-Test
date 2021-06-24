import { themeStateModel } from "../types/stateModel";

type actionModel = {
    type: (string | null | undefined ),
    data?: any,
}

let defaultState = {
    theme: 'light',
}

const themeReducer = (state:themeStateModel=defaultState, action:actionModel) => {
    switch(action.type) {
        case "SET_THEME": 
            const tempState = { ...state };
            tempState.theme = action.data; 
            return tempState;
        default: 
            return state; 
    }
}

export default themeReducer; 