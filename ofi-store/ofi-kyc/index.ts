import {combineReducers, Reducer} from 'redux';
import {KycMyInformationsReducer, KycMyInformationsState} from './my-informations';

export {
    KycMyInformations,
    SET_INFORMATIONS,
    setInformations,
} from './my-informations';

export interface KycState {
    myInformations: KycMyInformationsState;
}

export const KycReducer: Reducer<KycState> = combineReducers<KycState>({
    myInformations: KycMyInformationsReducer,
});
