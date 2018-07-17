import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {get as getValue, castArray} from 'lodash';
import {NgRedux} from '@angular-redux/store';

import {
    ChainService,
    MyWalletsService,
    InitialisationService
} from '@setl/core-req-services';
import {OfiKycService} from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';

@Component({
    template: ''
})
export class OfiConsumeTokenComponent implements OnInit {

    private invitationToken;
    private amcID;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private ofiKycService: OfiKycService,
        private chainService : ChainService,
        private myWalletsService : MyWalletsService,
        private ngRedux : NgRedux<any>
    ) {
    }

    ngOnInit() {
        this.getQueryParams();
    }

    getQueryParams() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.readParams(params);
        });
    }

    async readParams(params) {
        if (params.invitationToken) {
            await this.useInvitationToken(params.invitationToken);
        }

        if (params.redirect) {
            this.redirect(params);
        }
    }

    async useInvitationToken(token) {
        return this.ofiKycService.useInvitationToken(token).then(response => {
            this.amcID = getValue(response, [1, 'Data', 0, 'amcID']);

            // If it was the first signup, we also have granted chain access to the user
            InitialisationService.requestMyOwnWallets(this.ngRedux, this.myWalletsService);
            InitialisationService.requestMyChainAccess(this.ngRedux, this.chainService);
        });
    }

    removeTokenFromURL() {
        let newUrl = this.router.createUrlTree([], {
            queryParams: {invitationToken: null},
            queryParamsHandling: "merge"
        });

        this.location.replaceState(this.router.serializeUrl(newUrl));
    }

    redirect(params) {
        let destination = params.redirect;

        let extras = {
            queryParams : {}
        };
        if(params.invitationToken){
            extras.queryParams['invitationToken'] = params.invitationToken;
            extras.queryParams['amcID'] = this.amcID;
        }

        // If not redirecting to the information page, redirect to my-requests because we have a token
        if(destination.indexOf('new-investor') === -1) {
            destination = ['my-requests', 'new'];
        }

        destination = castArray(destination);

        this.router.navigate(destination, extras);
    }
}