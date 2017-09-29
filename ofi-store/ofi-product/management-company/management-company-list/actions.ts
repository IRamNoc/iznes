import {
    Action,
    ActionCreator,
} from 'redux';

import {name} from './__init__';
import {Common, SagaHelper} from '@setl/utils';
import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';

/**
 * Set Management Company
 * @type {string}
 */
export const SET_MANAGEMENT_COMPANY_LIST = `${name}/SET_MANAGEMENT_COMPANY_LIST`;

