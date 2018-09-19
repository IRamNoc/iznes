import { Injectable } from '@angular/core';
import { AlertEmit, UpdateEmit } from './interfaces/alert-emit';
import { Subject } from 'rxjs/Subject';
import { AlertSettings } from './interfaces/alert-settings';
import { AlertType } from './interfaces/alert-type';

@Injectable()
export class AlertsService {
    alert$: Subject<AlertEmit> = new Subject();
    update$: Subject<UpdateEmit> = new Subject();

    create(type: AlertType, message: string = null, settingsOverrides: AlertSettings = {},
           titleMessage: string | boolean = false): Subject<any> {
        const create$ = new Subject();
        this.alert$.next({ type, message, titleMessage, override: settingsOverrides });
        this.alert$.subscribe((d) => {
            if (d.close) {
                create$.next();
            }
        });
        return create$;
    }

    /**
     * Generate
     * --------
     * Format the message with HTML to meet UI standards before creating the alert
     *
     * @param type
     * @param message
     * @param settingsOverrides
     * @param titleMessage
     */
    generate(type: AlertType, message: string = null, settingsOverrides: AlertSettings = {},
             titleMessage: string | boolean = false) {
        const alertClass = (type === 'error') ? 'danger' : type;
        message = `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-${alertClass}">${message}</td>
                    </tr>
                </tbody>
            </table>`;
        const create$ = new Subject();
        this.alert$.next({ type, message, titleMessage, override: settingsOverrides });
        this.alert$.subscribe((d) => {
            if (d.close) {
                create$.next();
            }
        });
        return create$;
    }

    close() {
        this.alert$.next({ close: true });
    }

    updateView(type, message: string) {
        this.update$.next({ type, message });
    }
}
