import {Action} from 'redux';
import {MyWalletContractState} from './model';
import {
    SET_CONTRACT_LIST,
    CLEAR_CONTRACT_NEED_HANDLE,
    SET_LAST_CREATED_CONTRACT_DETAIL,
    UPDATE_LAST_CREATED_CONTRACT_DETAIL
} from './actions';
import _ from 'lodash';
import {immutableHelper} from '@setl/utils';
import {ContractModel} from '@setl/core-contracts/models';

const initialState: MyWalletContractState = {
    contractList: [],
    lastCreated: {
        txHash: '',
        contractAddress: '',
        contractExpiry: 0,
        metaData: {},
        inBlockchain: false,
        needHandle: false,
    }
};

export const MyWalletContractReducer = function (state: MyWalletContractState = initialState,
                                                 action: Action): MyWalletContractState {

    switch (action.type) {
        case SET_CONTRACT_LIST:
            return handleSetContractList(state, action);

        case SET_LAST_CREATED_CONTRACT_DETAIL:
            return handleSetLastCreatedContractDetail(state, action);

        case UPDATE_LAST_CREATED_CONTRACT_DETAIL:
            return updateLastCreatedContractDetail(state, action);

        case CLEAR_CONTRACT_NEED_HANDLE:
            return handleClearContractNeedHandle(state);

        default:
            return state;
    }
};

function handleSetContractList(state: MyWalletContractState, action: any): MyWalletContractState {
    const contractList = [
        {
            contractData: _.get(action, 'payload[1].data', []),
            requested: false
        }
    ];
    return Object.assign({}, state, {
       contractList
    });
}

function handleSetLastCreatedContractDetail(state: MyWalletContractState, action: any): MyWalletContractState {
    const contractData = _.get(action, 'data[1].data', {});
    const txHash = _.get(contractData, 'hash', '');
    const contractAddress = _.get(contractData, 'toaddr', '');
    const contractExpiry = _.get(contractData, 'contractdata.expiry', 0);
    const inBlockchain = false;
    const needHandle = true;
    const metaData = _.get(action, 'metaData', {});

    const lastCreated = {
        txHash,
        contractAddress,
        contractExpiry,
        inBlockchain,
        needHandle,
        metaData
    };

    return Object.assign({}, state, {
        lastCreated
    });
}

function updateLastCreatedContractDetail(state: MyWalletContractState, action: any): MyWalletContractState {
    // find all updated contract.
    const contractUpdateData = _.get(action, 'data.Data.contracts', []);

    // the last contract's address.
    const lastCreatedContractAddress = state.lastCreated.contractAddress;

    // all the contract that matched the last created contract's address.
    const matchedContract = immutableHelper.filter(contractUpdateData, (entry) => {
        return entry === lastCreatedContractAddress;
    });

    const inBlockchain = matchedContract.length > 0;
    const oldLastCreated = state.lastCreated;
    const lastCreated = Object.assign({}, oldLastCreated, {
        inBlockchain
    });

    return Object.assign({}, state, {
        lastCreated
    });
}

/**
 * handle clear contract need handle.
 * @param state
 * @return {{}&MyWalletContractState&{lastCreated: ({}&LastContractDetail&{needHandle: boolean})}}
 */
function handleClearContractNeedHandle(state: MyWalletContractState) {
    const oldLastCreated = state.lastCreated;
    const needHandle = false;
    const lastCreated = Object.assign({}, oldLastCreated, {
        needHandle
    });

    return Object.assign({}, state, {
        lastCreated
    });
}
