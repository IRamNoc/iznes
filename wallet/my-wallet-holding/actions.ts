import {
    ActionCreator
} from 'redux';

import {name} from './__init__';
import {Common, SagaHelper} from '@setl/utils';
import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';

/**
 * Set wallet list
 */
export const SET_WALLET_HOLDING = `${name}/SET_WALLET_HOLDING`;
export const SET_ISSUE_HOLDING = `${name}/SET_ISSUE_HOLDING`;
