import {Injectable} from '@angular/core';
import {select} from '@angular-redux/store';

@Injectable()
export class LogService {

    private subscription;
    private production;

    @select(['user', 'siteSettings', 'production']) productionRedux: any;

    constructor(){
        this.subscription = this.productionRedux.subscribe((production) => { this.production = production; });
    }

    log(...args) {
        if (!this.production) console.log(...args);
    }
}
