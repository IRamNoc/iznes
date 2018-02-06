import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-ui-info-pane',
    template: `<div class="alert alert-warning">
        <div class="alert-items">
            <div class="alert-item static">
                <div class="alert-icon-wrapper">
                    <clr-icon class="alert-icon" shape="exclamation-triangle"></clr-icon>
                </div>
                <span class="alert-text">{{message}}</span>
            </div>
        </div>
    </div>`
})
export class UiInfoPaneComponent {

    @Input() message: string = '';

    constructor() { }
}
