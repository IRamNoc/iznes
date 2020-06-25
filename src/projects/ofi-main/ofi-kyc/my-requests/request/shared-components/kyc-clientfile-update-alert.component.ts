import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'kyc-clientfile-update-alert',
    template: `
        <div class="alert alert-app-level alert-info" role="alert">
            <div class="alert-items">
                <div class="alert-item static">
                    <div class="alert-icon-wrapper">
                        <clr-icon class="alert-icon" shape="info-circle"></clr-icon>
                    </div>
                    <div class="alert-text">
                        {{'Before we can continue, KYC Client file needs to be updated.' | translate}}
                    </div>
                    <div class="alert-actions">
                        <button type="button" class="btn alert-action" (click)="handleAction()">{{'Update Client File' | translate}}</button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class KycClientFileUpdateAlert {
    constructor(
        private router: Router,
    ){}

    handleAction() {
        this.router.navigate(['onboarding-requests', 'list'], {
            queryParams: {
                redirectClientFile: true,
            },
        });
    }
}
