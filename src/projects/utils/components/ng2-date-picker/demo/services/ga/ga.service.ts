import {Injectable} from '@angular/core';

declare const ga: Function;

@Injectable()
export class GaService {

    public emitEvent(eventCategory: string,
                     eventAction: string,
                     eventLabel: string = null,
                     eventValue: number = null) {
        if (true && window['ga']) {
            ga('send', 'event', {
                eventCategory: eventCategory,
                eventLabel: eventLabel,
                eventAction: eventAction,
                eventValue: eventValue
            });
        }
    }
}
