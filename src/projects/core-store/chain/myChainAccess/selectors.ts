import {createSelector} from 'reselect';
import {MyChainAccessState} from './index';
import {ChainState} from '../index';

const getChainState = (state): ChainState => state.chain;

export const getMyChainAccess = createSelector(
    getChainState,
    (state: ChainState) => state.myChainAccess);

// use the first chain access as default.
export const getDefaultMyChainAccess = createSelector(
    getMyChainAccess,
    (state: MyChainAccessState) => {
        const firstKey = Object.keys(state.myChainAccess)[0];
        if (firstKey) {
            const firstChainAccess = state.myChainAccess[firstKey];
            return Object.assign({}, firstChainAccess);
        } else {
            return false;
        }
    }
);
