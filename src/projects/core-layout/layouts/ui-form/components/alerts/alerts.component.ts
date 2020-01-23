import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {ConfirmationService, LogService} from '@setl/utils';

@Component({
    selector: 'app-ui-layouts-alerts',
    templateUrl: './alerts.component.html',
    styles: [`
        .padding {
            padding: 0 20px 20px;
        }

        .toggle-info-panes {
            display: block;
            padding-bottom: 10px;
            text-decoration: none;

        &
        :before,

        &
        :after {
            text-decoration: none;
        }

        }`
    ]
})
export class UiAlertsComponent {

    showInfoPanes: boolean = true;

    constructor(private alerts: AlertsService, private _confirmationService: ConfirmationService, private logService: LogService) {
    }

    toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
    }

    // alerts
    showSimpleAlert(): void {
        this.alerts.create('success', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-success">This is a success alert</td>
                    </tr>
                </tbody>
            </table>
        `);
    }

    showTabledAlert(): void {
        this.alerts.create('success', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="left"><b>Item 1:</b></td>
                        <td>Value 1</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Item 2:</b></td>
                        <td>Value 2</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Item 3:</b></td>
                        <td>Value 3</td>
                    </tr>
                    <tr>
                        <td class="left"><b>Item 4:</b></td>
                        <td>Value 4</td>
                    </tr>
                </tbody>
            </table>
        `);
    }

    showErrorAlert(): void {
        this.alerts.create('error', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-danger">This is an error alert</td>
                    </tr>
                </tbody>
            </table>
        `);
    }

    showInfoAlert(): void {
        this.alerts.create('info', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-ifno">This is a info alert, we can add alot more information in here if we wish too.</td>
                    </tr>
                </tbody>
            </table>
        `);
    }

    showWarningAlert(): void {
        this.alerts.create('warning', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-warning">This is a warning alert</td>
                    </tr>
                </tbody>
            </table>
        `);
    }

    showCheckAlert(): void {
        this._confirmationService.create(
            '<span>Are you sure?</span>',
            '<span>Ok i see, Lets just check you want to do this?</span>',
            {confirmText: 'Confirm', declineText: 'Cancel'}
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.logService.log('button confirmation has been pressed (check alert)');
            }
        });
    }

    showConfirmationAlert(): void {
        this._confirmationService.create(
            '<span>Confirmation</span>',
            '<span>You sure you want to make this happen, really?</span>',
            {confirmText: 'Confirm', declineText: 'Cancel', btnClass: 'success'}
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.logService.log('button confirmation has been pressed (confirmation alert)');
            }
        });
    }

    showRejectAlert(): void {
        const var1 = 'Items to delete';
        this._confirmationService.create(
            '<span>Are you sure?</span>',
            '<span>Maybe if we put more info in here what happens, Are you sure you want to delete \'' + var1 + '\'?</span>',
            {confirmText: 'Remove', declineText: 'Cancel', btnClass: 'error'}
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.logService.log('button remove has been pressed');
            }
        });
    }

}
