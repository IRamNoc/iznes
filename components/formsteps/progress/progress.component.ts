import { Component, Input, HostBinding } from '@angular/core';

@Component({
    selector: 'form-steps-progress',
    templateUrl: './progress.component.html'
})
export class ProgressComponent {

    @HostBinding('class') class = 'steps-progress';
    @Input() config;

    getWidth() {
        return 100;
        //return (100 / this.config.length + '%');
    }
}
