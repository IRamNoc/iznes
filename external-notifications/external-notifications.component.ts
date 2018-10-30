import { Component, Input, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ConfirmationService, SagaHelper } from '@setl/utils';
import { NgRedux } from '@angular-redux/store';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { MyUserService } from '@setl/core-req-services';
import { MemberSocketService } from '@setl/websocket-service';
import * as _ from 'lodash';

@Component({
    selector: 'app-external-notifications',
    templateUrl: './external-notifications.component.html',
    styleUrls: ['./external-notifications.component.scss'],
})
export class ExternalNotificationsComponent implements OnInit, OnDestroy {
    @Input() userId: number;
    @Input() apiKey: string;

    copied = false;
    externalNotificationsStatus: {} = {};
    externalNotificationsEnabled: boolean;
    statusInterval: any;
    statusUpdated: {} = {
        state: false,
        consumers: false,
        messages_ready: false,
        messages_unacknowledged: false,
    };

    rabbitMQEndpoint = `${window.location.protocol}//${window.location.hostname}:5672`;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private ngRedux: NgRedux<any>,
        private memberSocketService: MemberSocketService,
        private myUserService: MyUserService,
        private confirmationService: ConfirmationService) {
    }

    ngOnInit() {
        this.getExternalNotificationsStatus();
    }

    handleCopyApiKey(event) {
        const textArea = document.createElement('textarea');
        textArea.setAttribute('style', 'width:1px;border:0;opacity:0;');
        document.body.appendChild(textArea);
        textArea.value = this.apiKey;
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.copied = true;
        setTimeout(
            () => {
                this.copied = false;
                this.changeDetectorRef.markForCheck();
            },
            500,
        );
    }

    /**
     * Enables/disables a user's External Notification setting
     *
     * @param {boolean} setting
     * @return {void}
     */
    setExternalNotifications(setting: boolean) {
        this.alertsService.create('loading');

        const asyncTaskPipe = setting ?
            this.myUserService.registerNotifications() : this.myUserService.removeNotifications();

        this.confirmationService.create(
            `<span>${setting ? 'Enable' : 'Disable'} External Notifications</span>`,
            `<span class="text-warning">Are you sure you want to
                 ${setting ? 'enable' : 'disable'} External Notifications?</span>`,
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.ngRedux.dispatch(SagaHelper.runAsync(
                    [],
                    [],
                    asyncTaskPipe,
                    {},
                    (data) => {
                        if (setting) {
                            const response = data[1].Data;
                            if (response.hasOwnProperty('user') && response.hasOwnProperty('password')) {
                                this.alertsService.create('success', `
                                    <table class="table grid">
                                        <tbody>
                                            <tr>
                                                <td class="left"><b>Status:</b></td>
                                                <td>${response.status}</td>
                                            </tr>
                                            <tr>
                                                <td class="left"><b>Username:</b></td>
                                                <td>${response.user}</td>
                                            </tr>
                                            <tr>
                                                <td class="left"><b>Password:</b></td>
                                                <td>${response.password}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                `);
                                this.externalNotificationsEnabled = true;
                                this.getExternalNotificationsStatus();
                            } else {
                                this.alertsService.generate('error', 'Something has gone wrong. Please try again.');
                            }
                        } else {
                            this.externalNotificationsEnabled = false;
                            clearInterval(this.statusInterval);
                            this.alertsService.generate('success', 'External Notifications have been disabled.');
                        }
                        this.changeDetectorRef.detectChanges();
                    },
                    (data) => {
                        console.error('error: ', data);
                        this.alertsService.generate('error', 'External Notifications settings could not be changed.');
                    }),
                );
            }
        });
    }

    /**
     * Checks if the user is enrolled with RabbitMQ and provides the status
     *
     * @return {object} status
     */
    getExternalNotificationsStatus(): any {
        const asyncTaskPipe = this.myUserService.statusNotifications();

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            (response) => {
                const previousStatus = this.externalNotificationsStatus;
                this.externalNotificationsStatus = _.get(response, '[1].Data', {});
                Object.keys(this.externalNotificationsStatus).forEach((status) => {
                    this.statusUpdated[status] = this.externalNotificationsStatus[status] !== previousStatus[status] &&
                        !_.isEmpty(previousStatus);
                });
                this.externalNotificationsEnabled = true;
                this.setStatusInterval();
                this.changeDetectorRef.detectChanges();
            },
            () => {
                this.externalNotificationsEnabled = false;
                this.changeDetectorRef.detectChanges();
            },
        ));
    }

    /**
     * Sends a test message to RabbitMQ
     */
    sendTestMessage() {
        const asyncTaskPipe = this.myUserService.testNotifications();

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            () => {
                this.alertsService.generate('success', 'Test message successfully sent.');
                this.getExternalNotificationsStatus();
            },
            (response) => {
                console.error('error: ', response);
                this.alertsService.generate('error', 'Failed to send test message.');
            },
        ));
    }

    /**
     * Removes all messages from RabbitMQ
     */
    truncateQueue() {
        const asyncTaskPipe = this.myUserService.truncateNotifications();

        this.confirmationService.create(
            '<span>Delete Messages</span>',
            '<span class="text-warning">Are you sure you want to delete all messages?</span>',
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.ngRedux.dispatch(SagaHelper.runAsync(
                    [],
                    [],
                    asyncTaskPipe,
                    {},
                    () => {
                        this.alertsService.generate('success', 'Messages successfully deleted.');
                        this.getExternalNotificationsStatus();
                    },
                    (response) => {
                        console.error('error: ', response);
                        this.alertsService.generate('error', 'Failed to delete messages.');
                    },
                ));
            }
        });
    }

    /**
     * Set 10 second interval to get RabbitMQ status
     */
    setStatusInterval() {
        clearInterval(this.statusInterval);
        this.statusInterval = setInterval(
            () => {
                this.getExternalNotificationsStatus();
            },
            10000,
        );
    }

    ngOnDestroy() {
        clearInterval(this.statusInterval);
        this.changeDetectorRef.detach();
    }
}
