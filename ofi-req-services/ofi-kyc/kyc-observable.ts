import { Injectable } from '@angular/core';
import { select } from '@angular-redux/store';

import { Observable } from 'rxjs/Rx';
import { investorInvitation } from '../../ofi-store/ofi-kyc/invitationsByUserAmCompany/model';
import { OfiKycService } from './service';

/**
 * A less painful (hopefully) way to maintain a particular piece of data in redux.
 *
 * For example we are handling the following bit of data.
 * {
 *   request: boolean;
 *   kycList: kyc[];
 * }
 *
 * # Keeping the way that we monitor the flag of request in our redux.
 *      1. Monitor the "requested" flag.
 *          ```
 *              this.investorInvitationsRequested$.subscribe((requested) => {
 *                  this.requestInvitationsByAm(requested);
 *               });
 *          ```
 *      3. Build a function to make the request. If requested is true. we don't making the call.
 *          ```
 *             requestInvitationsByAm(requestedState) {
 *                   // If the state is false, that means we need to request the list.
 *                   if (!requestedState) {
 *                       // Request the list.
 *                       this._ofiKycService.fetchInvitationsByUserAmCompany();
 *                   }
 *               }
 *
 *          ```
 *
 * # A method that return an observable of the bit of data.
 *  For each bit of data from redux, in the case of our example, ['ofi', 'ofiKyc', 'investorInvitations', 'data'], we
 *  create a function that return of the observable of it.
 *      ```
 *         investorInvitationsSub(): Observable<investorInvitation[]> {
 *               // subscribe to requested flag on investor invitation.
 *               this.investorInvitationsRequested$.subscribe((requested) => {
 *                  this.requestInvitationsByAm(requested);
 *               });
 *
 *               return this.investorInvitations$;
 *           }
 *
 *      ```
 */
@Injectable()
export class OfiKycObservablesService {

    @select(['ofi', 'ofiKyc', 'investorInvitations', 'requested']) investorInvitationsRequested$;
    @select(['ofi', 'ofiKyc', 'investorInvitations', 'data']) investorInvitations$;

    constructor(
        private _ofiKycService: OfiKycService,
    ) {}

    requestInvitationsByAm(requestedState) {
        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Request the list.
            this._ofiKycService.fetchInvitationsByUserAmCompany();
        }
    }

    /**
     * Subscribe to the investor invitation redux data, and return the observable.
     */
    investorInvitationsSub(): Observable<investorInvitation[]> {
        // subscribe to requested flag on investor invitation.
        this.investorInvitationsRequested$.subscribe((requested) => {
           this.requestInvitationsByAm(requested);
        });

        return this.investorInvitations$;
    }

}
