import {name} from './__init__';
import {Common, SagaHelper} from '@setl/utils';
import {Action, ActionCreator} from 'redux';

/**
 * Set wallet list
 */
export const SET_MESSAGE_LIST = `${name}/SET_MESSAGE_LIST`;

export const DONE_RUN_DECRYPT = `${name}/DONE_RUN_DECRYPT`;


export const SET_DECRYPTED_CONTENT = `${name}/SET_DECRYPTED_CONTENT`;

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

