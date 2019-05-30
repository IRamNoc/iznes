import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {RemoteLoggerService} from "@setl/core-req-services";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) {}

    get logger() {
        return this.injector.get(RemoteLoggerService);
    }

    handleError(err: any): void {
        console.error(err + getStackTrace(err));
        this.logger.log('error', err.message + getStackTrace(err));
    }

}

const getStackTrace = function(err) {
    try {
        if(err.stack){
            return err.stack;
        }
        const obj = {stack: ''};
        Error.captureStackTrace(obj, getStackTrace);
        return obj.stack;
    } catch(e) {
       return  'not available';
    }
};
