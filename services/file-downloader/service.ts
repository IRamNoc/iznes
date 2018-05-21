import {HttpClient, HttpHandler, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AppConfig} from '../../appConfig/appConfig.model';
import {APP_CONFIG} from '../../appConfig/appConfig';

@Injectable()
export class FileDownloader {

    private appConfig: AppConfig;

    constructor(private http: HttpClient, @Inject(APP_CONFIG) appConfig: AppConfig) {
        this.appConfig = appConfig;
    }

    getFileDownloadBaseUrl(): string {
        const isProduction = this.appConfig.production;
        return isProduction ? `https://${window.location.hostname}/mn/file` :
            `http://${window.location.hostname}:9788/file`;
    }

    downLoaderFile(body: any) {
        this.http.request('POST', this.getFileDownloadBaseUrl(), {
            body: body,
            responseType: 'blob',
            observe: 'response'
        }).subscribe((response) => {
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
        }, (err) => {
        });
    }

    getDownLoaderUrl(body: any) {
        const $downLoadUrl: Subject<{ filename: string, url: string }> = new Subject();

        this.http.request('POST', this.getFileDownloadBaseUrl(), {
            body: body,
            responseType: 'blob',
            observe: 'response'
        }).subscribe((response) => {

            // generate temporary link to down file.
            const downloadUrl = window.URL.createObjectURL(response.body);
            const filename = response.headers.get('content-filename');

            $downLoadUrl.next({
                filename,
                url: downloadUrl
            });
        }, (err) => {
        });

        return $downLoadUrl;
    }


}

