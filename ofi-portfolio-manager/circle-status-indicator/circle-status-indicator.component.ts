import { Component, Input } from '@angular/core';

type StatusClass = 'success' | 'warning' | 'error' | 'default';

@Component({
    selector: 'circle-status-indicator',
    template: `
        <span class="circle" [ngClass]="statusClass"
             [ngStyle]="{'width': sizeString,
             'height': sizeString,
             'border-radius': radiusString,
             '-webkit-border-radius': radiusString,
             '-moz-border-radius': radiusString }" title="{{statusLabel}}"> </span>
    `,
    styleUrls: ['./circle-status-component.scss'],
})
export class CircleStatusIndicator {
    @Input()
    size: number = 10;

    @Input()
    statusClass: StatusClass = 'success';

    @Input()
    statusLabel: string = 'Success';

    get radiusString(): string {
        return (this.size / 2) + 'px';
    }

    get sizeString(): string {
        return this.size + 'px';
    }

}
