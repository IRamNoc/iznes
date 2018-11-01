/* Core/Redux imports. */
import { Action } from 'redux';

/* Local types. */
import { PortfolioManagerList } from './model';
import { OFI_SET_PM_LIST, OFI_SET_REQUESTED_PM_LIST, OFI_SET_PM_DETAIL, OFI_UPDATE_PM_DETAIL } from './actions';
import { immutableHelper } from '@setl/utils';
import { get, merge } from 'lodash';

/* Initial state. */
const initialState: PortfolioManagerList = {
    requested: false,
    portfolioManagerList: {},
};

/* Reducer. */
export const OfiPortfolioManagerListReducer = function (state: PortfolioManagerList = initialState,
                                                        action: Action) {
    switch (action.type) {

    case OFI_SET_REQUESTED_PM_LIST:
        return toggleRequestState(state, true);

    case OFI_SET_PM_LIST:
        return ofiSetPortfolioManagerList(state, action);

    case OFI_SET_PM_DETAIL:
        return ofiSetPmDetail(state, action);

    case OFI_UPDATE_PM_DETAIL:
        return ofiUpdatePmDetail(state, action);

    default:
        return state;
    }
};

/**
 * Set Portfolio manager list.
 * ---------------
 *
 * @param {PortfolioManagerList} state
 * @param {Action} action
 * @return {PortfolioManagerList}
 */
function ofiSetPortfolioManagerList(state: PortfolioManagerList, action: Action) {

    const data = get(action, 'payload[1].Data', []);

    const portfolioManagerList = data.reduce((accu, pm) => {
        accu[pm.pmID] = {
            pmId: pm.pmID,
            emailAddress: pm.emailAddress,
            userId: pm.userID,
            inviteId: pm.inviteID,
            firstName: pm.firstName,
            lastName: pm.lastName,
            pmActive: pm.userID !== null,
            fundAccess: {},
        };
        return accu;
    }, {});

    return Object.assign({}, state, {
        portfolioManagerList,
    });
}

/**
 * Set portfolio manager detail
 * @param {PortfolioManagerList} state
 * @param {Action} action
 * @return { PortfolioManagerList }
 */
function ofiSetPmDetail(state: PortfolioManagerList, action: Action) {
    const portfolioManagerList = immutableHelper.copy(state.portfolioManagerList);
    const pmDetailsPayLoad = get(action, 'payload[1].Data', []);
    const pmId = get(action, 'payload[1].Data[0].pmID', 0);

    portfolioManagerList[pmId].fundAccess = pmDetailsPayLoad.reduce((accu, pm) => {
        accu[pm.fundID] = {
            fundId: pm.fundID,
            kycId: pm.kycID,
            walletId: pm.walletID,
            status: pm.fundStatus === 1,
        };
        return accu;
    }, {});

    return Object.assign({}, state, {
        portfolioManagerList,
    });

}

/**
 * Update portfolio manager detail
 * @param {PortfolioManagerList} state
 * @param {Action} action
 * @return { PortfolioManagerList }
 */
function ofiUpdatePmDetail(state: PortfolioManagerList, action: Action) {
    const portfolioManagerList = immutableHelper.copy(state.portfolioManagerList);
    const pmDetailsPayLoad = get(action, 'pmDetail', {});
    const pmId = pmDetailsPayLoad.pmId;
    const fundId = pmDetailsPayLoad.fundId;

    try {
        portfolioManagerList[pmId].fundAccess[fundId] = {
            fundId,
            kycId: pmDetailsPayLoad.kycId,
            walletId: pmDetailsPayLoad.walletId,
            status: pmDetailsPayLoad.status === 1,
        };
    } catch (e) {
    }

    return Object.assign({}, state, {
        portfolioManagerList,
    });

}

/**
 *
 * @param {PortfolioManagerList} state
 * @param {boolean} requested
 * @return {PortfolioManagerList}
 */
function toggleRequestState(state: PortfolioManagerList, requested: boolean): PortfolioManagerList {
    return Object.assign({}, state, { requested });
}
