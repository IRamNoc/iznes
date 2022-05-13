import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Inject, OnChanges,
    SecurityContext, OnDestroy,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgRedux, select } from '@angular-redux/store';
import * as SagaHelper from '@setl/utils/sagaHelper';
import { AlertsService, AlertType } from '@setl/jaspero-ng2-alerts';
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeRequest } from '@setl/utils/common';
import { MultilingualService } from '@setl/multilingual';
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
})

export class FileViewerComponent implements OnInit, OnChanges, OnDestroy {
    @Input() fileHash: string = null;
    @Input() fileId: string = null;
    @Input() pdfId: string = null;
    @Input() viewType: ViewType = ViewType.Button;
    @Input() secure: boolean = false;
    @Input() securePath: string = '';
    @Input() isHelpDocument: boolean = false;

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
                    private translate: MultilingualService,
                    @Inject(APP_CONFIG) private appConfig: AppConfig,
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

    public getHelpPageDocument() {
        this.fileDownloader.getHelpPageDocument(
            Number(this.fileId),
            this.fileHash,
            this.secure,
            this.securePath,
            true
        ).then((result: any) => {
            const data = result[1].Data;
            const { fileName, downloadId } = data;
            const request = {
                method: 'retrieve',
                walletId: this.walletId,
                fileHash: this.fileHash,
                downloadId,
                secure: false,
                isHelpDocument : true
            };

            this.fileDownloader.getDownLoaderUrl(
                request,
                this.secure,
            ).subscribe((downloadData) => { 
                const downloadUrl = downloadData.url;
                this.previewModalService.open({
                    name: downloadData.filename,
                    url: this.sanitizer.bypassSecurityTrustResourceUrl(downloadUrl) as string,
                });
            })
        })
    }

    public openFileModal() {
        if (this.isHelpDocument) {
            this.getHelpPageDocument();
        } else {
            this.setFileHash().then(() => {
                this.validateFileExists();
            });
        }
    }

    public validateFileExists() {
        this.fileDownloader.validateFile(
            Number(this.fileId),
            this.fileHash,
            this.secure,
            this.securePath,
            false
        ).then((result: any) => {
            const data = result[1].Data;
            if (data.error) {
                this.previewModalService.close();
                this.showAlert(this.translate.translate('Unable to view file'), 'error');
            } else {
                const { fileName, downloadId } = data;
                const request = this.secure ?
                    this.getSecureFileRequest(downloadId) :
                    {
                        method: 'retrieve',
                        walletId: this.walletId,
                        downloadId,
                        secure: false,
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
        this.fileDownloader.validateFile(
            Number(this.fileId),
            this.fileHash,
            this.secure,
            this.securePath,
        ).then((result: any) => {
            const data = result[1].Data;
            if (data.error) {
                this.showAlert(this.translate.translate('Unable to download file'), 'error');
            } else {
                if (this.secure) {
                    this.downloadSecureFile(data.downloadId);
                    return;
                }
                this.fileDownloader.downLoaderFile({
                    method: 'retrieve',
                    walletId: this.walletId,
                    downloadId: data.downloadId,
                    download: true,
                });
            }
        });
    }

    public downloadSecureFile(downloadId: string) {
        this.fileDownloader.downLoaderFile(this.getSecureFileRequest(downloadId));
    }

    private getSecureFileRequest(downloadId: string) {
        return {
            method: 'retrieve',
            downloadId,
            token: this.memberSocketService.token,
            walletId: this.walletId,
            fileHash: this.fileHash,
            path: '/iznes/kyc-inv-docs',
            secure: true,
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

    ngOnDestroy(): void {
        this.changeDetectorRef.detach();
    }
}
