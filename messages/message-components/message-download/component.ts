import { Component, Input, OnInit } from '@angular/core';
import { WalletNodeSocketService } from '@setl/websocket-service';
import { NgRedux } from '@angular-redux/store';
import { AlertsService } from '@setl/jaspero-ng2-alerts/index';
import { CoreWorkflowEngineService } from '@setl/core-req-services';
import { MessagesService } from '../../../messages.service';
import { MemberSocketService } from '@setl/websocket-service';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

/**
 * SETL Message Body Component
 *
 * Displays the Message Body
 */
@Component({
    selector: 'setl-message-download',
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
})
export class SetlMessageDownloadComponent implements OnInit {

    @Input() url;
    @Input() userId;
    @Input() walletId: number;
    @Input() mailId: number;
    @Input() isActed: boolean; // from db

    messageBody: string = '';

    constructor (private walletNodeSocketService: WalletNodeSocketService,
                 private messagesService: MessagesService,
                 private ngRedux: NgRedux<any>,
                 private alertsService: AlertsService,
                 private coreWorkflowService: CoreWorkflowEngineService,
                 private memberSocketService: MemberSocketService,
                 private httpClient: HttpClient) {
    }

    ngOnInit() {

    }

    canShowButton() {
        return true;
    }

    performPost() {
        const postBody = {
            token: this.memberSocketService.token,
        };
        this.httpClient.post(
            this.url,
            postBody,
            {
                headers: { 'Content-Type': 'application/json', Accept: 'application/pdf' },
                responseType: 'blob' },
            ).subscribe(
                (res) => {
                    const url = window.URL.createObjectURL(res);
                    window.open(url);
                },
                (err) => {
                    console.error(err);
                },
            );
    }

    showErrorResponse (message) { // response could be an obj or str. here
        this.alertsService.create('error', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-danger">${message}</td>
                    </tr>
                </tbody>
            </table>
        `);
    }

    showSuccessResponse (message) {
        this.alertsService.create('success', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-success">${message}</td>
                    </tr>
                </tbody>
            </table>
        `);
    }
}
