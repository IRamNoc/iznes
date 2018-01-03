import { MailHelper } from './mailHelper';

export class MockMailHelper extends MailHelper {

    public constructor() {
    }

    public retrieveMessages(walletId, type = 'inbox', page = 0, pageSize = 8) {
    }

    /**
     * Decrypt Message
     *
     * @param {Object} message Message Object
     * @param {String} type    Message Type (e.g. sent)
     *
     * @return {Promise}
     */
    public decryptMessage(message, type = 'inbox') {
        message.content = 'Decrypted Message';
        return Promise.resolve(message);
    }

    public markMessageAsRead(walletId, mailId) {
    }
}