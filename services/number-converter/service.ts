import {Inject, Injectable} from '@angular/core';
import {APP_CONFIG} from '../../appConfig/appConfig';
import {AppConfig} from '../../appConfig/appConfig.model';

@Injectable()
export class NumberConverterService {

    private _appConfig: AppConfig;
    private divider: number;

    constructor(@Inject(APP_CONFIG) appConfig: AppConfig) {
        this.divider = appConfig.numberDivider;
    }

    toBlockchain(value: number): number {
        return value * this.divider;
    }

    toFrontEnd(value: number): number {
        return value / this.divider;
    }
}
