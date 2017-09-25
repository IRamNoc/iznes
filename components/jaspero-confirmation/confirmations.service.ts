import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {ConfirmSettings} from './interfaces/confirm-settings';
import {ConfirmSettings} from './interfaces/confirm-settings';
import {ResolveEmit} from './interfaces/resolve-emit';

@Injectable()
export class ConfirmationService {
    confirmation$ = new Subject<ConfirmSettings>();

    create(title: string, message: string, override: ConfirmSettings = {}) {
        const resolve$ = new Subject<ResolveEmit>();

        this.confirmation$.next({
            title,
            message,
            resolve$,
            override
        });

        return resolve$;
    }
}
