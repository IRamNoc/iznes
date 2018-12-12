/* Angular/vendor imports. */
import { Directive, ElementRef, EventEmitter, Output, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { MultilingualService } from '@setl/multilingual';
import { UserPreferenceService } from '@setl/core-req-services/user-preference/service';
import * as _ from 'lodash';

@Directive({
    selector: '[userTour]',
    providers: [UserPreferenceService],
})

export class UserTourDirective implements AfterViewInit, OnDestroy{

    private currentStage: number = 0;

    @Input() config: any = {
        tourName: '',
        stages: {},
    };
    @Output() rowsUpdate: EventEmitter<any> = new EventEmitter();

    constructor(
        private el: ElementRef,
        private translate: MultilingualService,
        private userPreferenceService: UserPreferenceService,
    ) {
    }

    ngAfterViewInit() {
        this.userPreferenceService.getUserPreference({ key: this.config.tourName }).then((response) => {
            const completedTour = _.get(response, '[1].Data[0].value', false);
            if (!completedTour) {
                this.launchUserTour();
            }
        });

        this.createLaunchTrigger();
    }

    launchUserTour() {
        this.currentStage = 0;

        this.el.nativeElement.classList.add('usertour');

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        this.el.nativeElement.insertBefore(overlay, this.el.nativeElement.firstChild);

        // Remove overflow hidden on datagrids
        this.el.nativeElement.querySelectorAll('.datagrid-overlay-wrapper').forEach((datagrid) => {
            datagrid.classList.add('visible');
        });

        this.createStage(Object.keys(this.config.stages)[0]);
    }

    createLaunchTrigger() {
        const triggerParentEl = this.el.nativeElement.querySelector('.header-breadcrumbs');
        const triggerDiv = document.createElement('div');
        /*triggerDiv.innerHTML = `
            <button id="launch-btn-${this.config.tourName}" class="btn btn-primary">
            <i class="fa fa-question-circle"></i> Launch User Tour</button>`;*/
        triggerDiv.innerHTML = `
            <i id="launch-btn-${this.config.tourName}" class="fa fa-question-circle text-primary launch-user-tour"></i>`;

        triggerParentEl.appendChild(triggerDiv);

        this.el.nativeElement.querySelector(`#launch-btn-${this.config.tourName}`)
            .addEventListener('click', () => this.launchUserTour());

    }

    createStage(stage) {
        const stageEl = this.el.nativeElement.querySelector(`#${stage}`);

        stageEl.classList.add('stage');
        stageEl.classList.add(this.config.stages[stage].horizontalPosition);
        stageEl.classList.add(this.config.stages[stage].verticalPosition);

        const signpost = document.createElement('span');
        const totalStages = Object.keys(this.config.stages).length;
        const prevBtnHTML = this.currentStage > 0 ?
            `<button id="${stage}-prev-btn" class="btn btn-outline btn-prev">Prev</button>` : '';
        signpost.innerHTML = `
                    <i id="close-user-tour-${stage}" class="fa fa-times close-btn"></i>
                    <h2><!--<i class="fa fa-question-circle text-primary"></i>-->${this.config.stages[stage].title}</h2>
                    <p>${this.config.stages[stage].text}</p>
                    ${prevBtnHTML}
                    <button id="${stage}-next-btn" class="btn btn-outline btn-next">
                        ${(totalStages - 1) === this.currentStage ? 'Close' : 'Next'}</button>
                    <p class="stage-number">${this.currentStage + 1} of ${totalStages}</p>`;

        stageEl.appendChild(signpost);

        const prevBtn = this.el.nativeElement.querySelector(`#${stage}-prev-btn`);
        const nextBtn = this.el.nativeElement.querySelector(`#${stage}-next-btn`);
        const closeBtn = this.el.nativeElement.querySelector(`#close-user-tour-${stage}`);

        nextBtn.addEventListener('click', () => this.prepNextStage());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prepPrevStage());
        closeBtn.addEventListener('click', () => this.closeUserTour());
    }

    prepNextStage() {
        this.closeCurrentStage();

        this.currentStage += 1;

        if (this.currentStage === Object.keys(this.config.stages).length) {
            this.closeUserTour();
            return;
        }
        this.createStage(Object.keys(this.config.stages)[this.currentStage]);
    }

    prepPrevStage() {
        this.closeCurrentStage();

        this.currentStage -= 1;

        if (this.currentStage === Object.keys(this.config.stages).length) {
            this.closeUserTour();
            return;
        }
        this.createStage(Object.keys(this.config.stages)[this.currentStage]);
    }

    closeCurrentStage() {
        const lastStage = Object.keys(this.config.stages)[this.currentStage];

        this.removeEventListeners(lastStage);

        const currentStageEl = this.el.nativeElement.querySelector(`#${lastStage}`);
        if (currentStageEl) {
            currentStageEl.lastChild.remove();
            currentStageEl.className = '';
        }
    }

    closeUserTour() {
        // Close stage
        this.closeCurrentStage();

        // Remove overlay
        this.el.nativeElement.querySelector('.usertour .overlay').remove();

        // Remove overflow hidden override on datagrids
        this.el.nativeElement.querySelectorAll('.datagrid-overlay-wrapper').forEach((datagrid) => {
            datagrid.classList.remove('visible');
        });
    }

    removeEventListeners(lastStage) {
        const nextBtn = this.el.nativeElement.querySelector(`#${lastStage}-next-btn`);
        if (nextBtn) nextBtn.removeEventListener('click', () => this.prepNextStage());

        const prevBtn = this.el.nativeElement.querySelector(`#${lastStage}-prev-btn`);
        if (prevBtn) prevBtn.removeEventListener('click', () => this.prepPrevStage());

        const closeBtn = this.el.nativeElement.querySelector(`#close-user-tour-${lastStage}`);
        if (closeBtn) closeBtn.removeEventListener('click', () => this.closeUserTour());
    }

    ngOnDestroy() {
        this.el.nativeElement.querySelector(`#launch-btn-${this.config.tourName}`)
            .removeEventListener('click', () => this.launchUserTour());
    }
}
