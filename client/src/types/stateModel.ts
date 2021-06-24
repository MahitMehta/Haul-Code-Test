import {  userStateModel } from "./userData";

export type stateModel = {
    userData: userStateModel,
    theme: themeStateModel
}

export type themeStateModel = {
    theme: string
}