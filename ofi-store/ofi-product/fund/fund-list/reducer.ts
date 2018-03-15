import {Action} from 'redux';
import * as FundActions from './actions';
import {FundDetail, FundListState, IznesFundDetail} from './model';
import * as _ from 'lodash';
import {fromJS, Map, OrderedMap} from 'immutable';

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
    // console.log('reducer fundShare', rawFundShareData);
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
    let iznFundList = OrderedMap();

    data.map((fund) => {
        const fundData: IznesFundDetail = {
            fundName: fund.fundName,
            isFundStructure: fund.isFundStructure,
            umbrellaFundID: fund.umbrellaFundID,
            umbrellaFundName: fund.umbrellaFundName,
            lei: fund.legalEntityIdentifier,
            registerOffice: fund.registerOffice,
            registerOfficeAddress: fund.registerOfficeAddress,
            domicile: fund.domicile,
            isEuDirective: fund.isEuDirective,
            typeOfEuDirective: fund.typeOfEuDirective,
            uitsVersion: fund.UcitsVersion,
            legalForm: fund.legalForm,
            nationalNomenclatureOfLegalForm: fund.nationalNomenclatureOfLegalForm,
            homeCountryLegalType: fund.homeCountryLegalType,
            fundCreationDate: fund.fundCreationDate,
            fundLaunchate: fund.fundLaunchate,
            fundCurrency: fund.fundCurrency,
            openOrCloseEnded: fund.openOrCloseEnded,
            fiscalYearEnd: fund.fiscalYearEnd,
            isFundOfFund: fund.isFundOfFund,
            managementCompanyID: fund.managementCompanyID,
            managementCompanyName: fund.managementCompanyName,
            fundAdministrator: fund.fundAdministrator,
            custodianBank: fund.custodianBank,
            investmentManager: fund.investmentManager,
            principalPromoter: fund.principalPromoter,
            payingAgent: fund.payingAgent,
            fundManagers: fund.fundManagers,
            transferAgent: fund.transferAgent,
            centralizingAgent: fund.centralizingAgent,
            isDedicatedFund: fund.isDedicatedFund,
            portfolioCurrencyHedge: fund.portfolioCurrencyHedge,
            globalItermediaryIdentification: fund.globalItermediaryIdentification,
            delegatedManagementCompany: fund.delegatedManagementCompany,
            investmentAdvisor: fund.investmentAdvisor,
            auditor: fund.auditor,
            taxAuditor: fund.taxAuditor,
            legalAdvisor: fund.legalAdvisor,
            directors: fund.directors,
            pocket: fund.pocket,
            hasEmbeddedDirective: fund.hasEmbeddedDirective,
            hasCapitalPreservation: fund.hasCapitalPreservation,
            capitalPreservationLevel: fund.capitalPreservationLevel,
            capitalPreservationPeriod: fund.capitalPreservationPeriod,
            hasCppi: fund.hasCppi,
            cppiMultiplier: fund.cppiMultiplier,
            hasHedgeFundStrategy: fund.hasHedgeFundStrategy,
            isLeveraged: fund.isLeveraged,
            has130Or30Strategy: fund.has130Or30Strategy,
            isFundTargetingEos: fund.isFundTargetingEos,
            isFundTargetingSri: fund.isFundTargetingSri,
            isPassiveFund: fund.isPassiveFund,
            hasSecurityiesLending: fund.hasSecurityiesLending,
            hasSwap: fund.hasSwap,
            hasDurationHedge: fund.hasDurationHedge,
            investmentObjective: fund.investmentObjective
        };

        iznFundList = iznFundList.set(fund.fundID, fundData);
    });

    // TODO: to remove when it goes live
    console.log('handleGetIznesFunds (fundList): ', iznFundList);

    return Object.assign({}, state, {
        iznFundList
    });
}
