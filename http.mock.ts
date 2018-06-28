import {Injectable} from '@angular/core';
import {HttpClient, RequestOptionsArgs} from '@angular/common/http';

Injectable();

export class HttpMock extends HttpClient {
    public constructor() {
        super(null, null);
    }

    public get(url: string, options?: RequestOptionsArgs): any {
        return {
            subscribe(next: any, error: any) {
                next({
                    fileName: 'FileName',
                    mimeType: 'application/pdf'
                });
            }
        };
    }
}
