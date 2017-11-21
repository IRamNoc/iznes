import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Inject, OnChanges} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {select, NgRedux} from '@angular-redux/store';
import {Http} from '@angular/http';
import {AlertsService, AlertType} from '@setl/jaspero-ng2-alerts';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper} from '@setl/utils';
import {PdfService} from '@setl/core-req-services/pdf/pdf.service';
import {APP_CONFIG, AppConfig} from '@setl/utils';

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

    private appConfig: AppConfig;
    private baseUrl = '';
    private validateUrl = '';

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['user', 'myDetail', 'userId']) getUser;

    /**
     * Constructor
     */
    public constructor(
        private alertsService: AlertsService,
        private http: Http,
        private memberSocketService: MemberSocketService,
        private sanitizer: DomSanitizer,
        private pdfService: PdfService,
        private changeDetectorRef: ChangeDetectorRef,
        private ngRedux: NgRedux<any>,
        @Inject(APP_CONFIG) appConfig: AppConfig
    ) {
        this.appConfig = appConfig;
        this.baseUrl = 'http';
        if (this.appConfig.MEMBER_NODE_CONNECTION.port === 443) {
            this.baseUrl = 'https';
        }
        this.baseUrl += '://' + this.appConfig.MEMBER_NODE_CONNECTION.host + ':' +
           this.appConfig.MEMBER_NODE_CONNECTION.port;
        this.token = this.memberSocketService.token;
        this.getUser.subscribe(
            (data) => {
                this.userId = data;
            }
        );
        this.getConnectedWallet.subscribe(
            (data) => {
                this.walletId = data;
            }
        );
    }

    /**
     * On Init
     *
     * @return {void}
     */
    public ngOnInit() {
        if (this.pdfId !== null) {
        } else {
            this.setUrls();
        }
    }

    public ngOnChanges() {
        this.fileUrl = null;
    }

    /**
     * Set URLs
     *
     * @return {void}
     */
    public setUrls() {
        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.baseUrl +
            '/mn/file?' +
            'method=retrieve' +
            '&userId=' + this.userId +
            '&walletId=' + this.walletId +
            '&token=' + this.token +
            '&fileHash=' + this.fileHash
        );
        this.validateUrl = this.baseUrl +
            '/mn/file?' +
            'method=validate' +
            '&userId=' + this.userId +
            '&walletId=' + this.walletId +
            '&token=' + this.token +
            '&fileHash=' + this.fileHash;
    }

    /**
     * Open File Modal
     *
     * @return {void}
     */
    public openFileModal() {
        if (this.pdfId !== null && this.fileUrl === null) {
            this.getPdf(this.pdfId).then(
                (fileHash: string) => {
                    this.fileHash = fileHash;
                    this.setUrls();
                    this.openFileModal();
                },
                (error) => {
                    this.showAlert(error, 'error');
                }
            );
        }
        if (this.fileUrl === null) {
            return;
        }
        this.http.get(this.validateUrl).subscribe(
            (response) => {
                const data = response.json();
                if (data.error) {
                    this.fileModal = false;
                    this.showAlert('Unable to view file', 'error');
                } else {
                    this.fileModal = true;
                    this.fileName = data.fileName;
                    this.fileType = data.mimeType;
                }

                this.changeDetectorRef.markForCheck();
            },
            err => {
                this.showAlert(err, 'error');
            }
        );
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

    /**
     * Get PDF
     *
     * @param pdfID
     *
     * @return {void}
     */
    getPdf(pdfID) {
        const asyncTaskPipe = this.pdfService.getPdf({
            pdfID: pdfID
        });
        return new Promise((resolve, reject) => {
            this.ngRedux.dispatch(
                SagaHelper.runAsyncCallback(
                    asyncTaskPipe,
                    (data) => {
                        if (data && data[1] && data[1].Data) {
                            resolve(data[1].Data);
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                )
            );
        });
    }
}
