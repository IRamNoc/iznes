/* Core/Angular imports. */
import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';

import * as _ from 'lodash';

/* Actions. */
import {
    OFI_SET_COUPON_LIST,
    clearRequestedNavFundsList,
    ofiClearRequestedHomeOrder,
    ofiClearRequestedMyOrder,
    ofiClearRequestedManageOrder,
    clearRequestedFundAccessMy,
    ofiClearRequestedIssuedAssets,
    clearRequestedCollectiveArchive,
    ofiSetNewOrderManageOrder,
    setamkyclist,
    clearrequested
} from '../../ofi-store';
import {clearRequestedUmbrellaFund} from '../../ofi-store/ofi-product/umbrella-fund/umbrella-fund-list/actions';
import {clearRequestedIznesFunds} from '../../ofi-store/ofi-product/fund/fund-list/actions';
import {clearRequestedIznesShares} from '../../ofi-store/ofi-product/fund-share-list/actions';

import {resetHomepage} from '@setl/core-store';

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
        console.log(' |--- Resolving Ofi channel brodcast.');
        console.log(' | name: ', data.Request);
        console.log(' | data: ', data);
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

                handleUpdateNav(this.ngRedux);
                break;

            case 'newArrangementList':
                console.log('----------got new arrangement update-----');

                this.ngRedux.dispatch(ofiClearRequestedHomeOrder());
                this.ngRedux.dispatch(ofiClearRequestedMyOrder());
                this.ngRedux.dispatch(ofiClearRequestedManageOrder());
                this.ngRedux.dispatch(clearRequestedCollectiveArchive());
                break;

            case 'getfundaccessmy':
                this.ngRedux.dispatch(clearRequestedNavFundsList());
                this.ngRedux.dispatch(clearRequestedFundAccessMy());
                break;

            case 'izncreateorderbyinvestor':
                this.ngRedux.dispatch(ofiSetNewOrderManageOrder());
                break;

            case 'updatekyc':
                this.ngRedux.dispatch(clearrequested());
                this.ngRedux.dispatch(setamkyclist());
                break;
                
            case 'kycaccepted':
                //enable menu.
                this.ngRedux.dispatch(resetHomepage());

            // new umbrella fund created and umbrella fund updated.
            // todo
            // At the moment, this broacast will cause the front-end to request all the umbrella fund
            // when create/update umbrella fund.
            // we should broadcast the changes from the backend. and the front should just handle the new/updated entry
            // to avoid to make another call.
            case 'izncreateumbrellafund':
            case 'iznupdateumbrellafund':
                this.ngRedux.dispatch(clearRequestedUmbrellaFund());
                break;

            // new fund created and fund updated.
            // todo
            // At the moment, this broacast will cause the front-end to request all the fund
            // when create/update fund.
            // we should broadcast the changes from the backend. and the front should just handle the new/updated entry
            // to avoid to make another call.
            case 'izncreatefund':
            case 'iznupdatefund':
                this.ngRedux.dispatch(clearRequestedIznesFunds());
                break;

            // new fund share created and fund share updated.
            // todo
            // At the moment, this broacast will cause the front-end to request all the fund share
            // when create/update fund share.
            // we should broadcast the changes from the backend. and the front should just handle the new/updated entry
            // to avoid to make another call.
            case 'iznescreatefundshare':
            case 'iznesupdatefundshare':
                this.ngRedux.dispatch(clearRequestedIznesShares());
                break;
        }
    }
}

function handleUpdateNav(ngRedux) {
    ngRedux.dispatch(ofiClearRequestedIssuedAssets());
    ngRedux.dispatch(clearRequestedNavFundsList());
}
