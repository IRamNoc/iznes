import {MailHelper} from './mailHelper';
import {NgRedux} from '@angular-redux/store';
import {MyMessagesService} from '@setl/core-req-services/my-messages/my-messages.service';
import {LogService} from '@setl/utils';

export class MockMailHelper extends MailHelper {

    constructor(ngRedux: any, myMessageService: any, private logService: LogService,) {
        super(ngRedux, myMessageService);
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
        return new Promise((resolve, reject) => {
            message.isDecrypted = true;
            message.content = 'Decrypted Message';
            this.logService.log('calling this one');
            resolve(message);
        });
    }

    public markMessageAsRead(walletId, mailId) {
    }

    public deleteMessage(walletId, message) {
    }
}
