import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {SagaHelper} from '@setl/utils';

@Injectable()
export class ChannelService {

    constructor() {
    }

    /**
     * Resolve Channel Message
     * Works out what data has been emitted on the channel and dispatches the correct saga event.*/
    public resolveChannelMessage(data: any): void {

        console.log('--- Im finally in channel service');
        console.log(data);

        // The Hench Switch Statement of Channels.
        switch (data.messageName) {
            case 'update_user_message':

                break;

            default:
                break;
        }

        // import every update action from core redux
    }

}
