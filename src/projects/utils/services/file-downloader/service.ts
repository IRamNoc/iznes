import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfig } from '../../appConfig/appConfig.model';
import { APP_CONFIG } from '../../appConfig/appConfig';
import { MemberSocketService } from '@setl/websocket-service';
import { select } from '@angular-redux/store';
import { createMemberNodeRequest } from '@setl/utils/common';

@Injectable()
export class FileDownloader {

    @select(['user', 'connected', 'connectedWallet']) walletId$;
    private walletId: number;
    private appConfig: AppConfig;

    constructor(
        private http: HttpClient,
        @Inject(APP_CONFIG) appConfig: AppConfig,
        private memberSocketService: MemberSocketService,
    ) {
        this.appConfig = appConfig;
        this.walletId$.subscribe(id => this.walletId = id);
    }

    getFileDownloadBaseUrl(secure: boolean): string {
        return this.appConfig.production ? `https://${window.location.hostname}/mn/file` :
            `http://${window.location.hostname}:9788/file`;
    }

    downLoaderFile(body: any, secure = false) {
        return new Promise((resolve, reject) => {
            this.http.request('POST', this.getFileDownloadBaseUrl(secure), {
                body,
                responseType: 'blob',
                observe: 'response',
            }).subscribe(
                (response) => {
                    // generate temporary link to down file.
                    const downloadUrl = window.URL.createObjectURL(response.body);
                    const a = document.createElement('a');
                    const fileName = response.headers.get('content-filename');

                    document.body.appendChild(a);
                    a.setAttribute('style', 'display: none');
                    a.href = downloadUrl;
                    a.download = fileName;
                    a.click();

                    window.URL.revokeObjectURL(downloadUrl);
                    console.log(downloadUrl);
                    a.remove(); // remove the element

                    resolve('File download complete');
                },
                (err) => {
                    reject(err);
                },
            );
        });
    }

    validateFile(fileId: number, hash: string, secure: boolean = false, path = '') {
        const messageBody: any = {
            RequestName: 'validateFile',
            token: this.memberSocketService.token,
            walletId: `${this.walletId}`,
            fileHash: hash,
            fileId,
            secure,
            path,
        };
        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    getDownLoaderUrl(body: any, secure = false) {
        const $downLoadUrl: Subject<{ filename: string, url: string }> = new Subject();

        this.http.request('POST', this.getFileDownloadBaseUrl(secure), {
            body,
            responseType: 'blob',
            observe: 'response',
        }).subscribe((response) => {

            // generate temporary link to down file.
            const downloadUrl = window.URL.createObjectURL(response.body);
            const filename = response.headers.get('content-filename');

            $downLoadUrl.next({
                filename,
                url: downloadUrl,
            });
        },           (err) => {
        });

        return $downLoadUrl;
    }

}
