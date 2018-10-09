import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { get as getValue, castArray } from 'lodash';
import { NgRedux } from '@angular-redux/store';

import {
    ChainService,
    MyWalletsService,
    InitialisationService
} from '@setl/core-req-services';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';

@Injectable()
export class ConsumeTokenService {

    private amcID;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private ofiKycService: OfiKycService,
        private ngRedux: NgRedux<any>,
        private myWalletsService: MyWalletsService,
        private chainService: ChainService,
    ) {
    }

    async consumeToken(invitationToken) {
        await this.ofiKycService.useInvitationToken(invitationToken).then(
            (response) => {
                const amcID = getValue(response, [1, 'Data', 0, 'amcID']);

                // If it was the first signup, we also have granted chain access to the user
                InitialisationService.requestMyOwnWallets(this.ngRedux, this.myWalletsService);
                InitialisationService.requestMyChainAccess(this.ngRedux, this.chainService);

                this.amcID = amcID;
            },
        );
    }

    redirect(params) {
        let destination = params.redirect;

        const extras = {
            queryParams: {},
        };
        if (params.invitationToken) {
            extras.queryParams['invitationToken'] = params.invitationToken;
            extras.queryParams['amcID'] = this.amcID;
        }

        // If not redirecting to the information page, redirect to my-requests because we have a token
        if (destination.indexOf('new-investor') === -1) {
            destination = ['my-requests', 'new'];
        }

        destination = castArray(destination);

        this.router.navigate(destination, extras);
    }

}