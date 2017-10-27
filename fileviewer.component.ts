import {Component, Input} from '@angular/core';
import {select} from '@angular-redux/store';
import {MemberSocketService} from '@setl/websocket-service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Http} from '@angular/http';
import {AlertsService, AlertType} from '@setl/jaspero-ng2-alerts';

@Component({
    selector: 'setl-file-viewer',
    templateUrl: 'fileviewer.component.html',
    styleUrls: ['fileviewer.component.css']
})

export class FileViewerComponent {
    @Input() fileHash: string = null;
    public token: string =  null;
    public userId: string = null;
    public walletId: string = null;
    public fileUrl: SafeResourceUrl = null;
    public fileName: string = null;
    public fileType: string = null;
    public fileModal: boolean = false;

    private baseUrl: string = 'http://localhost:9788';
    private validateUrl: string = '';

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['user', 'myDetail', 'userId']) getUser;
    /**
     * Constructor
     */
    public constructor (
        private alertsService: AlertsService,
        private http: Http,
        private memberSocketService: MemberSocketService,
        private sanitizer: DomSanitizer
    ) {
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
     * Init
     *
     * @return {void}
     */
    public ngOnInit() {
        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.baseUrl +
            '/file?' +
            'method=retrieve' +
            '&userId=' + this.userId +
            '&walletId=' + this.walletId +
            '&token=' + this.token +
            '&fileHash=' + this.fileHash
        );
        this.validateUrl = this.baseUrl +
            '/file?' +
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
            },
            err => {
                console.log('Error: ' + err);
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
}
