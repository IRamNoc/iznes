import {
    Component,
    ChangeDetectorRef,
    ChangeDetectionStrategy
} from '@angular/core';

@Component({
    styleUrls: ['./component.css'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiHomeComponent {
    /* Constructor. */
    constructor (
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        /* Stub. */
    }
}
