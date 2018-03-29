import {Injectable} from '@angular/core';
import {AlertEmit, UpdateEmit} from './interfaces/alert-emit';
import {Subject} from 'rxjs/Subject';
import {AlertSettings} from './interfaces/alert-settings';
import {AlertType} from './interfaces/alert-type';

@Injectable()
export class AlertsService {
    alert$: Subject<AlertEmit> = new Subject();
    update$: Subject<UpdateEmit> = new Subject();

    create(type: AlertType, message: string, settingsOverrides: AlertSettings = {}, titleMessage: string | boolean  = false) {
        this.alert$.next({type: type, message: message, titleMessage, override: settingsOverrides});
    }

    updateView(type, message: string) {
        this.update$.next({type, message});
    }
}
