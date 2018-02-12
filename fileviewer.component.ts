import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Inject, OnChanges} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {NgRedux, select} from '@angular-redux/store';
import {SagaHelper} from '@setl/utils';
import {AlertsService, AlertType} from '@setl/jaspero-ng2-alerts';
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';

import {PdfService} from '@setl/core-req-services/pdf/pdf.service';
import {APP_CONFIG, AppConfig} from '@setl/utils';

import {ValidateFileMessageBody} from "./fileviewer.module";

@Component({
    selector: 'setl-file-viewer',
    templateUrl: 'fileviewer.component.html',
    styleUrls: ['fileviewer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FileViewerComponent implements OnInit, OnChanges {
    @Input() fileHash: string = null;
    @Input() pdfId: string = null;
    public token: string = null;
    public userId: string = null;
    public walletId: string = null;
    public fileUrl: SafeResourceUrl = null;
    public fileName: string = null;
    public fileType: string = null;
    public fileModal = false;
    public baseUrl = '';
    public downloadId: string = null;

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['user', 'myDetail', 'userId']) getUser;

    /**
     * Constructor
     */
    public constructor(
        private alertsService: AlertsService,
        private memberSocketService: MemberSocketService,
        public sanitizer: DomSanitizer,
        private pdfService: PdfService,
        private changeDetectorRef: ChangeDetectorRef,
        private ngRedux: NgRedux<any>,
        @Inject(APP_CONFIG) private appConfig: AppConfig
    ) {
        this.appConfig = appConfig;
        this.baseUrl = 'http';
        if (this.appConfig.MEMBER_NODE_CONNECTION.port === 443) {
            this.baseUrl = 'https';
        }
        this.baseUrl += '://' + this.appConfig.MEMBER_NODE_CONNECTION.host + ':' +
           this.appConfig.MEMBER_NODE_CONNECTION.port;
        this.token = this.memberSocketService.token;
        if (this.getUser) {
            this.getUser.subscribe(
                (data) => {
                    this.userId = data;
                }
            );
        }
        if (this.getConnectedWallet) {
            this.getConnectedWallet.subscribe(
                (data) => {
                    this.walletId = data;
                }
            );
        }
    }

    public ngOnInit() {

    }

    public ngOnChanges() {
        this.fileUrl = null;
    }

    public setFileHash() {
        if (this.pdfId !== null && this.fileUrl == null) {
            return new Promise((resolve) => {
                this.pdfService.getPdf(this.pdfId).then(
                    (fileHash) => {
                        this.fileHash = fileHash;
                        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                            this.baseUrl +
                            '/mn/file?' +
                            'method=retrieve' +
                            '&downloadId=' + this.downloadId
                        );
                        resolve();
                    }
                );
            });
        }
        return new Promise((resolve) => {
            this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.baseUrl +
                '/mn/file?' +
                'method=retrieve' +
                '&downloadId=' + this.downloadId
            );
            resolve();
        });
    }

    public openFileModal() {
        return new Promise((resolve, reject) => {
            this.setFileHash().then(() => {
                this.validateFileExists().then(() => {
                    resolve();
                }, (error) => {
                    console.log('Error occurred!' + error);
                    reject();
                });
            });
        });
    }

    public validateFileExists() {
        const messageBody: ValidateFileMessageBody = {
            RequestName: 'validateFile',
            token: this.memberSocketService.token,
            walletId: this.walletId,
            fileHash: this.fileHash
        };

        return new Promise((resolve, reject) => {
            const asyncTaskPipes = createMemberNodeSagaRequest(this.memberSocketService, messageBody);
            this.ngRedux.dispatch(SagaHelper.runAsync(
                [],
                [],
                asyncTaskPipes,
                {},
                (result) => {
                    const data = result[1].Data;
                    if (data.error) {
                        this.fileModal = false;
                        this.fileName = null;
                        this.fileType = null;
                        this.showAlert('Unable to view file', 'error');
                    } else {
                        this.fileModal = true;
                        this.fileName = data.filename;
                        this.fileType = data.mimeType;
                        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                            this.baseUrl +
                            '/mn/file?' +
                            'method=retrieve' +
                            '&downloadId=' + data.downloadId +
                            '&walletId=' + this.walletId
                        );
                    }
                    this.changeDetectorRef.markForCheck();
                    resolve();
                },
                (err) => {
                    this.showAlert(err, 'error');
                    reject();
                }
            ));
        });
    }

    /**
     * Close File Modal
     *
     * @return {void}
     */
    public closeFileModal() {
        this.fileModal = false;
    }

    /**
     * Show Alert
     *
     * @param {string} message
     * @param {string} level
     *
     * @return {void}
     */
    public showAlert(message, level = 'error') {
        this.alertsService.create(level as AlertType, `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-${level}">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }
}
