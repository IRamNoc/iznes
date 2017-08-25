import {
    ActionCreator
} from 'redux';

import {name} from './__init__';
import {Common, SagaHelper} from '@setl/utils';
import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';

/**
 * Set wallet list
 */
export const SET_WALLET_ADDRESSES = `${name}/SET_WALLET_ADDRESSES`;

