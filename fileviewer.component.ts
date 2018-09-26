import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Inject, OnChanges,
    SecurityContext,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgRedux, select } from '@angular-redux/store';
import * as SagaHelper from '@setl/utils/sagaHelper';
import { AlertsService, AlertType } from '@setl/jaspero-ng2-alerts';
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeRequest } from '@setl/utils/common';

import { PdfService } from '@setl/core-req-services/pdf/pdf.service';
import { APP_CONFIG } from '@setl/utils/appConfig/appConfig';
import { AppConfig } from '@setl/utils/appConfig/appConfig.model';
import { FileDownloader } from '@setl/utils/services/file-downloader/service';

import { ValidateFileMessageBody } from './fileviewer.model';
import { FileViewerPreviewService } from './preview-modal/service';

enum ViewType {
    Button = 0,
    Link = 1,
    Download = 2,
}

@Component({
    selector: 'setl-file-viewer',
    templateUrl: 'fileviewer.component.html',
    styleUrls: ['fileviewer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FileViewerComponent implements OnInit, OnChanges {
    @Input() fileHash: string = null;
    @Input() fileId: string = null;
    @Input() pdfId: string = null;
    @Input() viewType: ViewType = ViewType.Button;
    @Input() secure: boolean = false;
    @Input() securePath: string = '';
    public token: string = null;
    public userId: string = null;
    public walletId: string = null;
    public fileUrl: SafeResourceUrl = null;
    public baseUrl = '';
    public downloadId: string = null;

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['user', 'myDetail', 'userId']) getUser;

    /**
     * Constructor
     */
    public constructor(private alertsService: AlertsService,
                       private memberSocketService: MemberSocketService,
                       public sanitizer: DomSanitizer,
                       private pdfService: PdfService,
                       private changeDetectorRef: ChangeDetectorRef,
                       private ngRedux: NgRedux<any>,
                       private previewModalService: FileViewerPreviewService,
                       private fileDownloader: FileDownloader,
                       @Inject(APP_CONFIG) private appConfig: AppConfig) {
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
                },
            );
        }
        if (this.getConnectedWallet) {
            this.getConnectedWallet.subscribe(
                (data) => {
                    this.walletId = data;
                },
            );
        }
    }

    public ngOnInit() {

    }

    public ngOnChanges() {
        this.fileUrl = null;
    }

    public setFileHash() {
        return new Promise((resolve) => {
            if (this.pdfId !== null && this.fileUrl == null) {
                this.pdfService.getPdf(this.pdfId).then(
                    (fileHash) => {
                        this.fileHash = fileHash;
                        resolve();
                    },
                );
            } else {
                resolve();
            }
        });

    }

    public openFileModal() {
        this.setFileHash().then(() => {
            this.validateFileExists();
        });
    }

    public validateFileExists() {
        const messageBody: ValidateFileMessageBody = {
            RequestName: 'validateFile',
            token: this.memberSocketService.token,
            walletId: this.walletId,
            fileHash: this.fileHash,
            fileId: this.fileId,
            secure: this.secure,
            path: this.securePath,
        };

        createMemberNodeRequest(this.memberSocketService, messageBody).then((result) => {
            const data = result[1].Data;
            if (data.error) {
                this.previewModalService.close();
                this.showAlert('Unable to view file', 'error');
            } else {
                const fileName = data.filename;
                const downloadId = data.downloadId;
                const request = this.secure ?
                    this.getSecureFileRequest() :
                {
                    method: 'retrieve',
                    walletId: this.walletId,
                    downloadId,
                };

                this.fileDownloader.getDownLoaderUrl(
                    request,
                    this.secure,
                ).subscribe((downloadData) => {
                    const downloadUrl = downloadData.url;
                    this.previewModalService.open({
                        name: fileName ? fileName : downloadData.filename,
                        url: this.sanitizer.bypassSecurityTrustResourceUrl(downloadUrl) as string,
                    });
                });
            }
        });
    }

    public downloadFile() {
        if (this.secure) {
            this.downloadSecureFile();
            return;
        }

        const messageBody: ValidateFileMessageBody = {
            RequestName: 'validateFile',
            token: this.memberSocketService.token,
            walletId: this.walletId,
            fileHash: this.fileHash,
            fileId: this.fileId,
        };

        createMemberNodeRequest(this.memberSocketService, messageBody).then((result) => {
            const data = result[1].Data;
            if (data.error) {
                this.showAlert('Unable to download file', 'error');
            } else {
                this.fileDownloader.downLoaderFile({
                    method: 'retrieve',
                    walletId: this.walletId,
                    downloadId: data.downloadId,
                    download: true,
                });
            }
        });
    }

    public downloadSecureFile() {
        this.fileDownloader.downLoaderFile(
            this.getSecureFileRequest(),
            true,
        );
    }

    private getSecureFileRequest() {
        return {
            token: this.memberSocketService.token,
            walletId: this.walletId,
            fileHash: this.fileHash,
            path: '/iznes/kyc-inv-docs',
        };
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
