import {
    Component,
    HostBinding,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ContentChildren,
    AfterContentInit,
    ElementRef,
    ChangeDetectorRef,
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
    _disabled: boolean = false;

    get steps() {
        return this.stepComponents.reduce((acc, cur) => acc.concat([cur.step]), []);
    }

    get position() {
        return this._position;
    }
    set position(position) {
        this._position = position;
        this.setActive(position);
        this.setSubmittedPrevious(this.position);
        this.move();
        this.updateSubmitID();
    }

    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(state: boolean) {
        this._disabled = state;
    }

    constructor(
        private element: ElementRef,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
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
        this.disabled = true;
        this.go(-1);

        setTimeout(() => {
            this.disabled = false;
            this.changeDetectorRef.detectChanges();
        }, 600);
    }
    
    next() {
        this.disabled = true;
        this.go(1);

        setTimeout(() => {
            this.disabled = false;
            this.changeDetectorRef.detectChanges();
        }, 600);
    }

    go(offset) {
        this.position += offset;
    }

    move() {
        // Not using translate because we can't have modals (using fixed) as child of translate
        this.margin = `-${this.position * 100}%`;
        this.element.nativeElement.scrollTop = 0;
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

    isStepValid(): boolean {
        const stepComponent = this.getActiveComponent();

        if ((!stepComponent) || !stepComponent.step) return true;
        
        if (!stepComponent.step.isStepValid) return true;
        
        return stepComponent.step.isStepValid();
    }

    private getActiveComponent() {
        return this.stepComponents.toArray()[this._position];
    }

}
