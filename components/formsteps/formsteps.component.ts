import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ContentChildren,
    AfterContentInit,
    OnDestroy,
    ElementRef,
    ChangeDetectorRef,
} from '@angular/core';
import { FormstepComponent } from './formstep.component';
import { get as getValue } from 'lodash';

@Component({
    selector: 'form-steps',
    templateUrl: './formsteps.component.html',
})
export class FormstepsComponent implements AfterContentInit, OnDestroy {

    @ViewChild('submit', { read: ElementRef }) button;
    @ContentChildren(FormstepComponent) stepComponents;

    @Input() set stepsConfig(stepsConfig) {
        stepsConfig.forEach((step, index) => {
            this.progress.push({
                title: step.title,
                active: false,
                complete: false,
                parentStep: step.parentStep || false,
                children: step.children || [],
                hide: true,
            });

            this.stepsMap[step.title] = index;
        });

        this._stepsConfig = stepsConfig;
    }

    @Input() set onboarding(onboardingMode) {
        this._onboardingMode = onboardingMode;
    }

    get stepsConfig() {
        return this._stepsConfig;
    }

    @Output() action: EventEmitter<any> = new EventEmitter<any>();

    margin;
    _position;
    _stepsConfig;
    _onboardingMode;
    progress = [];
    _disabled: boolean = false;
    stepsMap: {} = {};
    mainContentEl: HTMLElement;
    fixStepsProgress: boolean = false;

    get steps() {
        return this.stepComponents.reduce((acc, cur) => acc.concat([cur.step]), []);
    }

    get position() {
        return this._position;
    }

    set position(position) {
        this._position = position;
        this.setActive(position);
        this.setSubmitted(this.position);
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
        this.progress[0].active = true;
        this.mainContentEl = document.querySelector('main.content-area');
        this.mainContentEl.addEventListener('scroll', e => this.handleFixStepsProgress(e));
    }

    /**
     * Handle fixing the steps progress side bar on scroll
     * @param e
     */
    handleFixStepsProgress(e) {
        const distanceToFixAt = 58;
        const distanceFromTop = getValue(e, 'target.scrollTop', 0);

        // Don't call detect changes if we don't have to
        if (this.fixStepsProgress && distanceFromTop >= distanceToFixAt) return;
        if (!this.fixStepsProgress && distanceFromTop < distanceToFixAt) return;

        this.fixStepsProgress = distanceFromTop >= distanceToFixAt;
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Pass mousewheel scroll to main content element if steps progress fixed
     * @param e
     */
    handleScroll(e) {
        if (this.fixStepsProgress) this.mainContentEl.scrollTop += e.deltaY;
    }

    setSubmitID(id) {

        // Put the attribute setting on the message queue, otherwise the new form will automatically be submitted
        // as we are in a click event

        setTimeout(() => {
            const button: HTMLElement = (this.button as ElementRef).nativeElement;

            if (id) {
                button.setAttribute('form', id);
                button.removeAttribute('type');
            } else {
                button.setAttribute('type', 'button');
                button.removeAttribute('form');
            }
        });
    }

    updateSubmitID() {
        this.setSubmitID(this.getForm());
    }

    askPrevious() {
        this.action.emit({
            type: 'previous',
        });
    }

    askClose() {
        this.action.emit({
            type: 'close',
        });
    }

    askNext() {
        this.action.emit({
            type: 'next',
        });
    }

    previous() {
        this.disabled = true;
        this.go(-1);

        setTimeout(
            () => {
                this.disabled = false;
                this.changeDetectorRef.detectChanges();
            },
            600,
        );
    }

    next() {
        this.disabled = true;
        this.go(1);

        setTimeout(
            () => {
                this.disabled = false;
                this.changeDetectorRef.detectChanges();
            },
            600,
        );
    }

    go(offset) {
        // Skip past parent steps
        if (getValue(this.progress, `[${this.position + offset}].children.length`, false)) {
            this.handleSubSteps(this.progress[this.position + offset], this.position);
            offset = this.position === 0 ? offset + 1 : offset * 2;
        }

        this.position += offset;
    }

    goToStep(step) {
        this.position = step;
    }

    move() {
        // Not using translate because we can't have modals (using fixed) as child of translate
        this.margin = `-${this.position * 100}%`;
        document.querySelector('main.content-area').scrollTop = 0;
    }

    setSubmitted(position) {
        let currentStep: any = {};
        this.progress.forEach((step, index) => {
            if (position === index) currentStep = { step, index };

            if (index < position) step.complete = true;
            step.active = position === index;

            // Reset all sub-steps to hidden
            step.hide = true;
        });

        this.handleSubSteps(currentStep.step, currentStep.index);
    }

    handleSubSteps(step, index) {
        // Show sub-steps
        if (step.parentStep) {
            this.progress[this.stepsMap[step.parentStep]].children
            .forEach(child => this.progress[this.stepsMap[child]].hide = false);

            // Set parent step to active
            this.progress[this.stepsMap[step.parentStep]].active = true;
        } else {
        // Hide sub-steps
            const prev = (this.progress[index - 1] || {}).parentStep;
            const next = (this.progress[index + 1] || {}).parentStep;
            if (prev || next) {
                this.progress[this.stepsMap[prev || next]].children
                .forEach(child => this.progress[this.stepsMap[child]].hide = true);
            }
        }
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
        const id = getValue(this.stepsConfig, [this.position, 'id']);
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

    ngOnDestroy() {
        this.mainContentEl.removeEventListener('scroll', e => this.handleFixStepsProgress(e));
    }
}
