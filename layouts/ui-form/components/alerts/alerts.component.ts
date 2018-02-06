import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {AlertsService} from '@setl/jaspero-ng2-alerts';

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

            &:before, &:after { text-decoration: none; }
        }`
    ]
})
export class UiAlertsComponent {

    showInfoPanes: boolean = true;

    constructor(private alerts: AlertsService) {}

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

}