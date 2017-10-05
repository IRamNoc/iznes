import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import _ from 'lodash';


@Injectable()
export class OfiMemberNodeChannelService {

    constructor(private ngRedux: NgRedux<any>) {
    }

    /**
     *  Handle member node channel update for ofi.
     *
     * @param data
     */
    resolveChannelUpdate(data: any): void {
        data = JSON.parse(data);

        switch (data.Request) {
            case 'udw':
                console.log('-----OFI | UPDATE MANAGE WALLET LIST: ', data);
                break;
            // case 'newmanagementcompany':
            //     console.log('-----OFI | INSERT MANAGEMENT COMPANY LIST: ', data);
            //     this.ngRedux.dispatch(SET_REQUESTED); // CLEAR = false | SET = true
            //     break;
        }
    }

}

