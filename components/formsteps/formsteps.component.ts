import {
    Component,
    HostBinding,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ContentChildren,
    AfterContentInit,
    ElementRef
} from '@angular/core';
import { FormstepComponent } from './formstep.component';
import { map, get as getValue } from 'lodash';

@Component({
    selector: 'form-steps',
    templateUrl: './formsteps.component.html'
})
export class FormstepsComponent implements AfterContentInit {

    @ViewChild('submit', { read: ElementRef }) button;
    @ContentChildren(FormstepComponent) stepComponents;

    @Input() set stepsConfig(stepsConfig) {
        this.progress = map(stepsConfig, (step) => ({
            title: step.title,
            active: false
        }));

        this._stepsConfig = stepsConfig;
    };

    get stepsConfig() {
        return this._stepsConfig;
    }

    @Output() action: EventEmitter<any> = new EventEmitter<any>();

    margin;
    _position;
    _stepsConfig;
    progress = [];

    get steps() {
        return this.stepComponents.reduce((acc, cur) => acc.concat([cur.step]), []);
    }

    set position(position) {
        this._position = position;
        this.setActive(position);
        this.setSubmittedPrevious(this.position);
        this.move();
        this.updateSubmitID();
    }

    get position() {
        return this._position;
    }

    constructor() {
    }

    ngAfterContentInit() {
        this.position = 0;
    }

    setSubmitID(id){

        // Put the attribute setting on the message queue, otherwise the new form will automatically be submitted
        // as we are in a click event

        setTimeout(() => {
            const button: HTMLElement = (this.button as ElementRef).nativeElement;

            if(id){
                button.setAttribute('form', id);
                button.removeAttribute('type');
            } else{
                button.setAttribute('type', 'button');
                button.removeAttribute('form');
            }
        });
    }

    updateSubmitID(){
        this.setSubmitID(this.getForm());
    }

    askPrevious() {
        this.action.emit({
            type: 'previous'
        });
    }

    askClose(){
        this.action.emit({
            type: 'close'
        });
    }

    askNext() {
        this.action.emit({
            type: 'next'
        });
    }

    previous() {
        this.go(-1);
    }

    next() {
        this.go(1);
    }

    go(offset) {
        this.position += offset;
    }

    move() {
        // Not using translate because we can't have modals (using fixed) as child of translate
        this.margin = `-${this.position * 100}%`;
    }

    setSubmittedPrevious(position) {
        let subArray = this.progress.slice(0, position);

        subArray.forEach((step, idx) => {
            this.setSubmitted(idx);
        });
    }

    setSubmitted(position) {
        this.progress[position].active = true;
    }

    setActive(position) {
        this.stepComponents.toArray().forEach((component, idx) => {
            component.active = position === idx;
        });
    }

    isEnd() {
        return this.position === this.stepsConfig.length - 1;
    }

    isBeginning() {
        return this.position === 0;
    }

    getForm() {
        let id = getValue(this.stepsConfig, [this.position, 'id']);
        return id || null;
    }

}
