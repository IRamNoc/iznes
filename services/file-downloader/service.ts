import {HttpClient} from '@angular/common/http';
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
            responseType: 'blob'
        }).subscribe((data) => {

            // generate temporary link to down file.
            const downloadUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = downloadUrl;
            a.download = '';
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            console.log(downloadUrl);
            a.remove(); // remove the element
        });
    }

    getDownLoaderUrl(body: any) {
        const $downLoadUrl: Subject<string> = new Subject();

        this.http.request('POST', this.getFileDownloadBaseUrl(), {
            body: body,
            responseType: 'blob'
        }).subscribe((data) => {

            // generate temporary link to down file.
            const downloadUrl = window.URL.createObjectURL(data);

            $downLoadUrl.next(downloadUrl);
        });

        return $downLoadUrl;
    }


}

