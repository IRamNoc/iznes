import {Injectable} from '@angular/core';

import * as model from '../OfiNav';

@Injectable()
export class OfiManageNavPopupService {

    private _share: model.NavInfoModel;
    private _mode: model.NavPopupMode;

    constructor() { }

    open(share: model.NavInfoModel, mode: model.NavPopupMode): void {
        this._share = share;
        this._mode = mode;
    }

    close(): void {
        this._share = null;
        this._mode = null;
    }

    share(): model.NavInfoModel {
        return this._share;
    }

    mode(): model.NavPopupMode {
        return this._mode;
    }

    isOpen(): boolean {
        return this._share != null && this._mode != null;
    }
}