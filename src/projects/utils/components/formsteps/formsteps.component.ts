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
    OnChanges, SimpleChanges, QueryList
} from '@angular/core';
import { FormstepComponent } from './formstep.component';
import { get as getValue, debounce } from 'lodash';
import { Observable } from 'rxjs/Observable';
import {filter, take, takeUntil} from 'rxjs/operators';
import {Subject} from "rxjs";

@Component({
    selector: 'form-steps',
    templateUrl: './formsteps.component.html',
})
export class FormstepsComponent implements AfterContentInit, OnDestroy, OnChanges {

    @ViewChild('submit', { read: ElementRef }) button;
    @ContentChildren(FormstepComponent) stepComponents;

    @Input() set stepsConfig(stepsConfig) {
        this.progress = [];
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

    private unsubscribe: Subject<any> = new Subject();
    _position;
    _stepsConfig;
    _onboardingMode;
    progress = [];
    _disabled: boolean = false;
    stepsMap: {} = {};
    mainContentEl: HTMLElement;
    fixStepsProgress: boolean = false;

    debounceScroll = debounce(this.handleScroll.bind(this), 10);
    debouncedFixStepsProgress = debounce(this.handleFixStepsProgress.bind(this), 10);
    public stepsComponentsArray: any[] = [];

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
        this.changeDetectorRef.detectChanges();
    }

    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(state: boolean) {
        this._disabled = state;
    }

    @Input()
    currentCompletedStep$: Observable<number>;

    constructor(
        private element: ElementRef,
        private changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngAfterContentInit() {
        this.stepsComponentsArray = this.stepComponents.toArray();
        this.progress[0].active = true;
        this.mainContentEl = document.querySelector('main.content-area');
        this.mainContentEl.addEventListener('scroll', this.debouncedFixStepsProgress);
        this.currentCompletedStep$.pipe(
            filter(a => a !== null && typeof a !== 'undefined'),
            take(1),
        ).subscribe((step) => {
            this.goToStep(step);
            this.next();
        });

        // update stepsComponentsArray when stepComponents was update.
        // Make sure the view is updated when stepConfigs was updated.
        this.stepComponents.changes.pipe(
            takeUntil(this.unsubscribe),
        ).subscribe((ch) => {
            this.stepsComponentsArray = this.stepComponents.toArray();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        // Make sure the view is updated when stepConfigs was updated.
        if ('stepsConfig' in changes) {
           this.stepsConfig = changes['stepsConfig'].currentValue;
            if (this.changeDetectorRef) this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Handle fixing the steps progress side bar on scroll
     * @param e
     */
    handleFixStepsProgress(e) {
        e.stopPropagation();
        const distanceToFixAt = 58;
        const distanceFromTop = getValue(e, 'target.scrollTop', 0);

        // Don't call detect changes if we don't have to
        if (this.fixStepsProgress && distanceFromTop >= distanceToFixAt) return;
        if (!this.fixStepsProgress && distanceFromTop < distanceToFixAt) return;

        this.fixStepsProgress = distanceFromTop >= distanceToFixAt;
        if (this.changeDetectorRef) this.changeDetectorRef.detectChanges();
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
        if (typeof step !== 'undefined') {
            this.position = step;
        }
    }

    move() {
        document.querySelector('main.content-area').scrollTop = 0;
    }

    setSubmitted(position) {
        if (position === -1) {
            position = 0
        }

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
            .forEach(child => {
                this.progress[this.stepsMap[child]].hide = false;
            });

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
        if (!!this.stepComponents) {
            this.stepComponents.toArray().forEach((component, idx) => {
                component.active = position === idx;
            });
        }
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
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.mainContentEl.removeEventListener('scroll', this.debouncedFixStepsProgress);
        this.changeDetectorRef.detach();
    }
}
