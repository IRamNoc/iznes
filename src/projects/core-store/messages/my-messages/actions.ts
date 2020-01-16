import {name} from './__init__';
import {Common, SagaHelper} from '@setl/utils';
import {Action, ActionCreator} from 'redux';
import {kAction} from '@setl/utils/common';

/**
 * Set wallet list
 */
export const SET_MESSAGE_LIST = `${name}/SET_MESSAGE_LIST`;

export const DONE_RUN_DECRYPT = `${name}/DONE_RUN_DECRYPT`;

export const SET_MESSAGE_COUNTS = `${name}/SET_MESSAGE_COUNTS`;

export const SET_DECRYPTED_CONTENT = `${name}/SET_DECRYPTED_CONTENT`;


export const SET_REQUEST_MAIL_INIT = `${name}/SET_REQUEST_MAIL_INIT`;
export const setRequestedMailInitial = kAction(SET_REQUEST_MAIL_INIT);

export const CLEAR_REQUEST_MAIL_INIT = `${name}/CLEAR_REQUEST_MAIL_INIT`;
export const clearRequestedMailInitial = kAction(CLEAR_REQUEST_MAIL_INIT);


export const SET_REQUEST_MAIL_LIST = `${name}/SET_REQUEST_MAIL_LIST`;
export const setRequestedMailList = kAction(SET_REQUEST_MAIL_LIST);

export const CLEAR_REQUEST_MAIL_LIST = `${name}/CLEAR_REQUEST_MAIL_LIST`;
export const clearRequestedMailList = kAction(CLEAR_REQUEST_MAIL_LIST);


export interface SetDecryptedContentAction extends Action {
    mailId: number;
    decrypted: string;
}

export const setDecryptedContent: ActionCreator<SetDecryptedContentAction> =
    (mailId, decrypted) => ({
        type: SET_DECRYPTED_CONTENT,
        mailId: mailId,
        decrypted: decrypted
    });

