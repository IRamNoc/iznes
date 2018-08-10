import {Action} from 'redux';

export interface MyKyc {
    email: string
}

export interface MyKycList {
    [kyc: number]: MyKyc
}

interface OpenTab {
    kycID: number,
    companyName: string,
    displayed: boolean
}

export interface MyKycOpenTabs extends Array<OpenTab> {
    [tab: number]: OpenTab
}

export interface MyKycListState {
    requested: boolean,
    kycList: MyKycList,
    tabs: MyKycOpenTabs
}

export interface MyKycListAction extends Action {
    type: string;
    payload: any;
}