import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { immutableHelper } from '@setl/utils';
import * as model from '../OfiNav';

@Injectable()
export class OfiManageNavPopupService {
    private _share: model.NavInfoModel;
    private _mode: model.NavPopupMode;

    onOpen: Subject<{share: model.NavInfoModel, mode: model.NavPopupMode}> = new Subject();
    onClose: Subject<ManageNavCloseEvent> = new Subject();

    constructor() { }

    open(share: model.NavInfoModel, mode: model.NavPopupMode): void {
        this._share = share;
        this._mode = mode;

        this.onOpen.next({ share, mode });
    }

    close(isSave: boolean): void {
        this.onClose.next({
            isSave,
            isCancel: !isSave,
            share: this._share ? immutableHelper.copy(this._share) : null,
        });

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

export interface ManageNavCloseEvent {
    isSave: boolean;
    isCancel: boolean;
    share: model.NavInfoModel;
}
