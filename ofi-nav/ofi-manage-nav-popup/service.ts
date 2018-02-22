import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import * as model from '../OfiNav';

@Injectable()
export class OfiManageNavPopupService {

    private _share: model.NavInfoModel;
    private _mode: model.NavPopupMode;

    onOpen: Subject<{share: model.NavInfoModel, mode: model.NavPopupMode}> = new Subject();
    onClose: Subject<void> = new Subject();

    constructor() { }

    open(share: model.NavInfoModel, mode: model.NavPopupMode): void {
        this._share = share;
        this._mode = mode;

        this.onOpen.next({ share: share, mode: mode });
    }
    
    close(): void {
        this._share = null;
        this._mode = null;

        this.onClose.next();
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