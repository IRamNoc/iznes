import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {ConfirmSettings} from './interfaces/confirm-settings';
import {ConfirmEmit} from './interfaces/comfirm-emit'
import {ResolveEmit} from './interfaces/resolve-emit';

@Injectable()
export class ConfirmationService {
    confirmation$ = new Subject<ConfirmEmit>();
    defaultConfirmationSettings: ConfirmSettings = {
        declineText: 'No',
        focusButton: 'decline',
    };

    create(title: string, message: string, override: ConfirmSettings = this.defaultConfirmationSettings) {
        const resolve$ = new Subject<ResolveEmit>();

        this.confirmation$.next({
            title,
            message,
            resolve$,
            override,
        });

        return resolve$;
    }
}
