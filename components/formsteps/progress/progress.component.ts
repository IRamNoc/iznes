import { Component, Input, Output, HostBinding, EventEmitter } from '@angular/core';

@Component({
    selector: 'form-steps-progress',
    templateUrl: './progress.component.html',
})
export class ProgressComponent {

    @HostBinding('class') class = 'steps-progress';
    @Input() config = [];
    @Output() jumpToStep: EventEmitter<any> = new EventEmitter();

    handleStepClick(index) {
        const step = this.config[index];
        const lastStepIsComplete = (this.config[index - 1] || {}).complete;
        if (step.complete || lastStepIsComplete) this.jumpToStep.emit(step.children.length ? index + 1 : index);
    }
}
