import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

Injectable();
export class HttpMock extends Http {
    public constructor() {
        super(null, null);
    }
    public get(url: any, options?: any) {
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
