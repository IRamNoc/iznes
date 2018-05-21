import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Inject, OnChanges,
    SecurityContext
} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {NgRedux, select} from '@angular-redux/store';
import * as SagaHelper from '@setl/utils/sagaHelper';
import {AlertsService, AlertType} from '@setl/jaspero-ng2-alerts';
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeRequest} from '@setl/utils/common';

import {PdfService} from '@setl/core-req-services/pdf/pdf.service';
import {APP_CONFIG} from '@setl/utils/appConfig/appConfig';
import {AppConfig} from '@setl/utils/appConfig/appConfig.model';
import {FileDownloader} from '@setl/utils';

import {ValidateFileMessageBody} from "./fileviewer.module";
import {FileViewerPreviewService} from './preview-modal/service';

enum ViewType {
    Button = 0,
    Link = 1
}

@Component({
    selector: 'setl-file-viewer',
    templateUrl: 'fileviewer.component.html',
    styleUrls: ['fileviewer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FileViewerComponent implements OnInit, OnChanges {
    @Input() fileHash: string = null;
    @Input() pdfId: string = null;
    @Input() viewType: ViewType = ViewType.Button;
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
        return new Promise((resolve) => {
            if (this.pdfId !== null && this.fileUrl == null) {
                this.pdfService.getPdf(this.pdfId).then(
                    (fileHash) => {
                        this.fileHash = fileHash;
                        resolve();
                    }
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
            fileHash: this.fileHash
        };

        createMemberNodeRequest(this.memberSocketService, messageBody).then((result) => {
            const data = result[1].Data;
            if (data.error) {
                this.previewModalService.close();
                this.showAlert('Unable to view file', 'error');
            } else {
                const fileName = data.filename;
                const downloadId = data.downloadId;

                this.fileDownloader.getDownLoaderUrl({
                    method: 'retrieve',
                    walletId: this.walletId,
                    downloadId: downloadId

                }).subscribe((downloadData) => {
                    const downloadUrl = downloadData.url;
                    this.previewModalService.open({
                        name: fileName,
                        url: this.sanitizer.bypassSecurityTrustResourceUrl(downloadUrl)
                    });
                });
            }
        });
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
