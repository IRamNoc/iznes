import {Action} from 'redux';
import * as FundActions from './actions';
import {FundDetail, FundListState, IznesFundDetail} from './model';
import * as _ from 'lodash';
import {fromJS, Map} from 'immutable';

const initialState: FundListState = {
    fundList: {},
    requested: false,
    iznFundList: {},
    requestedIznesFund: false
};

export const FundListReducer = function (state: FundListState = initialState, action: Action) {
    switch (action.type) {
        case FundActions.SET_FUND_LIST:

            const fdata = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

            const fundList = formatFundDataResponse(fdata);
            return Object.assign({}, state, {
                fundList
            });

        case FundActions.SET_FUND_SHARE_LIST:

            const fsdata = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

            const fundShareList = formatFundshareDataResponse(fsdata);
            return Object.assign({}, state, {
                fundShareList
            });

        case FundActions.SET_REQUESTED_FUND:
            return handleSetRequested(state, action);

        case FundActions.CLEAR_REQUESTED_FUND:
            return handleClearRequested(state, action);

        case FundActions.SET_REQUESTED_IZN_FUNDS:
            return handleSetIznesFundsRequested(state);

        case FundActions.CLEAR_REQUESTED_IZN_FUNDS:
            return clearSetIznesFundsRequested(state);

        case FundActions.GET_IZN_FUND_LIST:
            return handleGetIznesFunds(state, action);

        default:
            return state;
    }
};

function formatFundDataResponse(rawFundData: Array<any>): Array<FundDetail> {

    const rawFundDataList = fromJS(rawFundData);

    const fundDetailList = Map(rawFundDataList.reduce(
        function (result, item) {
            result[item.get('fundID')] = {
                fundID: item.get('fundID'),
                fundName: item.get('fundName'),
                fundProspectus: item.get('fundProspectus'),
                fundReport: item.get('fundReport'),
                fundLei: item.get('fundLei'),
                fundSICAVID: item.get('fundSICAVID'),
            };
            return result;
        },
        {}));

    return fundDetailList.toJS();
}

function formatFundshareDataResponse(rawFundShareData: Array<any>): Array<FundDetail> {
    const rawFundShareDataList = fromJS(rawFundShareData);

    const fundShareDetailList = Map(rawFundShareDataList.reduce(
        function (result, item) {
            result[item.get('fundID')] = {
                // fundID: item.get('fundID'),
                // fundName: item.get('fundName'),
                // fundProspectus: item.get('fundProspectus'),
                // fundReport: item.get('fundReport'),
                // fundLei: item.get('fundLei'),
                // fundSICAVID: item.get('fundSICAVID'),
            };
            return result;
        },
        {}));

    return fundShareDetailList.toJS();
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {FundListReducer}
 */
function handleSetRequested(state: FundListState, action: Action): FundListState {
    const requested = true;

    return Object.assign({}, state, {
        requested
    });
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {FundListReducer}
 */
function handleClearRequested(state: FundListState, action: Action): FundListState {
    const requested = false;

    return Object.assign({}, state, {
        requested
    });
}

function handleSetIznesFundsRequested(state: FundListState): FundListState {
    return Object.assign({}, state, {
        requestedIznesFund: true
    });
}

function clearSetIznesFundsRequested(state: FundListState): FundListState {
    return Object.assign({}, state, {
        requestedIznesFund: false
    });
}

function handleGetIznesFunds(state: FundListState, action: Action): any {
    const data = _.get(action, 'payload[1].Data', []);

    const iznFundList = data.reduce((sum, fund) => {
        const fundData: IznesFundDetail = {
            ..._.omit(fund, ['Status']),
            isFundStructure: fund.isFundStructure !== null ? fund.isFundStructure.toString() : null,
            homeCountryLegalType: fund.homeCountryLegalType !== null ? fund.homeCountryLegalType.toString() : null,
            isEuDirective: fund.isEuDirective.toString(),
            typeOfEuDirective: fund.typeOfEuDirective !== null ? fund.typeOfEuDirective.toString() : null,
            UcitsVersion: fund.UcitsVersion !== null ? fund.UcitsVersion.toString() : null,
            legalForm: fund.legalForm.toString(),
            nationalNomenclatureOfLegalForm: fund.nationalNomenclatureOfLegalForm !== null ? fund.nationalNomenclatureOfLegalForm.toString() : null,
            fundCreationDate: fund.fundCreationDate !== null ? fund.fundCreationDate.substr(0, 10) : null,
            fundLaunchate: fund.fundLaunchate !== null ? fund.fundLaunchate.substr(0, 10) : null,
            fundCurrency: fund.fundCurrency.toString(),
            openOrCloseEnded: fund.openOrCloseEnded.toString(),
            fiscalYearEnd: fund.fiscalYearEnd !== null ? fund.fiscalYearEnd.substr(0, 7) : null,
            isFundOfFund: fund.isFundOfFund.toString(),
            managementCompanyID: fund.managementCompanyID.toString(),
            fundAdministrator: fund.fundAdministrator.toString(),
            custodianBank: fund.custodianBank.toString(),
            investmentManager: fund.investmentManager !== null ? fund.investmentManager.toString() : null,
            principalPromoter: fund.principalPromoter !== null ? fund.principalPromoter.toString() : null,
            payingAgent: fund.payingAgent !== null ? fund.payingAgent.toString() : null,
            transferAgent: fund.transferAgent !== null ? fund.transferAgent.toString() : null,
            centralizingAgent: fund.centralizingAgent !== null ? fund.centralizingAgent.toString() : null,
            isDedicatedFund: fund.isDedicatedFund.toString(),
            portfolioCurrencyHedge: fund.portfolioCurrencyHedge.toString(),

            investmentAdvisor: fund.investmentAdvisor !== null ? fund.investmentAdvisor.toString() : null,
            auditor: fund.auditor !== null ? fund.auditor.toString() : null,
            taxAuditor: fund.taxAuditor !== null ? fund.taxAuditor.toString() : null,
            legalAdvisor: fund.legalAdvisor !== null ? fund.legalAdvisor.toString() : null,
            hasEmbeddedDirective: fund.hasEmbeddedDirective !== null ? fund.hasEmbeddedDirective.toString() : null,
            hasCapitalPreservation: fund.hasCapitalPreservation !== null ? fund.hasCapitalPreservation.toString() : null,
            capitalPreservationPeriod: fund.capitalPreservationPeriod !== null ? fund.capitalPreservationPeriod.toString() : null,
            hasCppi: fund.hasCppi !== null ? fund.hasCppi.toString() : null,
            hasHedgeFundStrategy: fund.hasHedgeFundStrategy !== null ? fund.hasHedgeFundStrategy.toString() : null,
            isLeveraged: fund.isLeveraged !== null ? fund.isLeveraged.toString() : null,
            has130Or30Strategy: fund.has130Or30Strategy !== null ? fund.has130Or30Strategy.toString() : null,
            isFundTargetingEos: fund.isFundTargetingEos !== null ? fund.isFundTargetingEos.toString() : null,
            isFundTargetingSri: fund.isFundTargetingSri !== null ? fund.isFundTargetingSri.toString() : null,
            isPassiveFund: fund.isPassiveFund !== null ? fund.isPassiveFund.toString() : null,
            hasSecurityiesLending: fund.hasSecurityiesLending !== null ? fund.hasSecurityiesLending.toString() : null,
            hasSwap: fund.hasSwap !== null ? fund.hasSwap.toString() : null,
            hasDurationHedge: fund.hasDurationHedge !== null ? fund.hasDurationHedge.toString() : null,
        };
        return {
            ...sum,
            [fund.fundID]: fundData
        };
    }, {});

    return {
        ...state,
        iznFundList,
    };
}
