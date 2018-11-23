import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { get as getValue } from 'lodash';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';

@Component({
    template: '',
})
export class OfiRedirectTokenComponent implements OnInit {
    private lang;
    private invitationToken;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private ofiKycService: OfiKycService,
    ) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            this.lang = params.lang;
            this.invitationToken = params.invitationToken;

            this.initChecks();
        });
    }

    initChecks() {
        this.checkToken(this.invitationToken).then(
            (response) => {
                const data = getValue(response, [1, 'Data', 0]);
                const investorCheck = getValue(data, ['hasInvestorBeenCreated']);
                const email = getValue(data, ['email']);
                const params : any = {
                    invitationToken : this.invitationToken,
                    email,
                };

                if (investorCheck) {
                    this.redirectToLogin(params);
                } else {
                    params.lang = this.lang;
                    this.redirectToSignup(params);
                }
            },
            (response) => {
                if (response === 'not_used') {
                    this.redirectToLogin({
                        error: true,
                    });
                } else {
                    const email = getValue(response, [1, 'Data', 0, 'email']);

                    this.redirectToLogin({
                        email,
                        error: true,
                    });
                }
            });
    }

    redirectToSignup(params) {
        const extras: any = {
            queryParams: params,
        };

        this.router.navigate(['signup'], extras);
    }

    redirectToLogin(params: any = {}) {
        const extras: any = {
            queryParams: params,
        };

        this.router.navigate(['login'], extras);
    }

    checkToken(token) {
        return this.ofiKycService.verifyInvitationToken(token).then(
            (result) => {
                return result;
            },
            () => {
                return this.checkIfUsed();
            },
        );
    }

    checkIfUsed() {
        return this.ofiKycService.isInvitationTokenUsed(this.invitationToken).then(
            (response) => {
                return Promise.reject(response);
            },
            () => {
                return Promise.reject('not_used');
            },
        );
    }
}
