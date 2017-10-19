/* Core/Angular imports. */
import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import _ from 'lodash';

/* Actions. */
import {
    OFI_SET_COUPON_LIST,
    ofiUpdateNavItem
} from '../../ofi-store';

/* Service class. */
@Injectable()
export class OfiMemberNodeChannelService {

    /* Constructor. */
    constructor(private ngRedux: NgRedux<any>) {
        /* Stub. */
    }

    /**
     * Resolve Channel Update
     * ----------------------
     * Hanldes a broadcasts aimed at Ofi requests.
     *
     * @param {object} data
     * @return {void}
     */
    resolveChannelUpdate(data: any): void {
        /* Parse the broadcast data. */
        data = JSON.parse(data);

        /* Switch the request. */
        console.log(" |--- Resolving Ofi channel brodcast.");
        console.log(" | name: ", data.Request);
        console.log(" | data: ", data);
        switch (data.Request) {
            /* Coupon requests. */
            case 'newcoupon':
            case 'updatecoupon':
                /* Dispatch the event. */
                this.ngRedux.dispatch(
                    {
                        type: OFI_SET_COUPON_LIST,
                        payload: [null, data, null]
                    }
                );

                /* Break. */
                break;

            case 'newmanagementcompany':
                console.log(' | Update managment company list: ', data);

                /* TODO - Dispatch the event to update the management company list. */
                // this.ngRedux.dispatch({
                //     type: SET_REQUESTED,
                //     payload: [ null, data, null ]
                // });

                /* Break. */
                break;

            case 'updatenav':

                handleUpdateNav(this.ngRedux, data);
                break;
        }
    }

}

function handleUpdateNav(ngRedux, data) {
    const fundName = _.get(data, 'Data[0].fundName', '');
    const navDate = _.get(data, 'Data[0].navDate', '');
    const price = _.get(data, 'Data[0].price', '');
    const status = _.get(data, 'Data[0].status', '');

    ngRedux.dispatch(ofiUpdateNavItem(fundName, navDate, price, status));
}
