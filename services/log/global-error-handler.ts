import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {RemoteLoggerService} from "@setl/core-req-services";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) {}

    get logger() {
        return this.injector.get(RemoteLoggerService);
    }

    handleError(err: any): void {
        console.error(err);
        this.logger.log('error', err.message);
    }
}

