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
                setTimeout(
                    () => {
                        this.launchUserTour();
                    },
                    200,
                );
            }
        });

        this.createLaunchTrigger();
    }

    /**
     * Launch User Tour
     * ----------------
     */
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

    /**
     * Create Launch Trigger
     * ---------------------
     */
    createLaunchTrigger() {
        const triggerParentEl = this.el.nativeElement.firstChild;
        triggerParentEl.firstChild.setAttribute('style', 'display: inline-block');
        const triggerDiv = document.createElement('div');
        triggerDiv.setAttribute('id', `launch-btn-${this.config.tourName}`);
        triggerDiv.classList.add('launch-user-tour');
        triggerDiv.innerHTML = '<i class="fa fa-question-circle text-primary user-tour-icon"></i>';
        triggerParentEl.appendChild(triggerDiv);

        this.el.nativeElement.querySelector(`#launch-btn-${this.config.tourName} .fa`)
            .addEventListener('click', () => this.launchUserTour());
    }

    /**
     * Create Stage
     * ------------
     * @param stage
     */
    createStage(stage) {
        const stageEl = this.el.nativeElement.querySelector(`div #${stage}`);

        // Preserve width of child element
        if (this.config.stages[stage].preserveWidth) stageEl.style.width = `${stageEl.offsetWidth}px`;

        stageEl.classList.add('stage');

        // Highlight child element
        if (this.config.stages[stage].highlight) stageEl.classList.add('highlight');

        const signpost = document.createElement('span');
        signpost.className = 'signpost';
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

        if (this.config.stages[stage].position) {
            stageEl.classList.add(this.config.stages[stage].position);
        } else {
            stageEl.classList.add(this.calculatePosition(stageEl, signpost));
        }

        stageEl.appendChild(signpost);

        signpost.scrollIntoView({ block: 'center' });

        const prevBtn = this.el.nativeElement.querySelector(`#${stage}-prev-btn`);
        const nextBtn = this.el.nativeElement.querySelector(`#${stage}-next-btn`);
        const closeBtn = this.el.nativeElement.querySelector(`#close-user-tour-${stage}`);

        nextBtn.addEventListener('click', () => this.prepNextStage());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prepPrevStage());
        closeBtn.addEventListener('click', () => this.closeUserTour());
    }

    calculatePosition(stageEl, signpostEl) {
        const offset = stageEl.getBoundingClientRect();
        const right = document.documentElement.clientWidth - offset.left;
        const bottom = document.documentElement.clientHeight - offset.top;
        const sidebarWidth = document.querySelector('nav.sidenav').clientWidth;
        const topbarHeight = document.querySelector('app-navigation-topbar').clientHeight;
        const signpostHeight = signpostEl.clientHeight;
        const signpostWidth = signpostEl.clientWidth;

        if (bottom > signpostHeight) {
            if (right > signpostWidth) return 'right-bottom';
            if (offset.left > (signpostWidth + sidebarWidth)) return 'left-bottom';
            return 'bottom-middle';
        }
        if (offset.top > (signpostHeight + topbarHeight)) {
            if (right > signpostWidth) return 'right-top';
            if (offset.left > (signpostWidth + sidebarWidth)) return 'left-top';
            return 'top-middle';
        }
        return 'right-bottom';
    }

    /**
     * Prepare Next Stage
     * ------------------
     */
    prepNextStage() {
        const stageKey = Object.keys(this.config.stages)[this.currentStage];

        if (this.config.stages[stageKey].hasOwnProperty('mustComplete')) {
            if (!this.config.stages[stageKey].mustComplete()) {
                console.log('+++ stage must complete', this.config);
                alert('you shall not pass!');
                return;
            }
        }

        this.closeCurrentStage();

        this.currentStage += 1;

        if (this.currentStage === Object.keys(this.config.stages).length) {
            this.closeUserTour();
            return;
        }
        this.createStage(Object.keys(this.config.stages)[this.currentStage]);
    }

    /**
     * Prepare Previous Stage
     * ----------------------
     */
    prepPrevStage() {
        this.closeCurrentStage();

        this.currentStage -= 1;

        if (this.currentStage === Object.keys(this.config.stages).length) {
            this.closeUserTour();
            return;
        }
        this.createStage(Object.keys(this.config.stages)[this.currentStage]);
    }

    /**
     * Close Current Stage
     * -------------------
     */
    closeCurrentStage() {
        const lastStage = Object.keys(this.config.stages)[this.currentStage];

        this.removeEventListeners(lastStage);

        const currentStageEl = this.el.nativeElement.querySelector(`#${lastStage}`);
        if (currentStageEl) {
            currentStageEl.lastChild.remove();
            ['top', 'bottom', 'left', 'right', 'stage'].forEach((classToRemove) => {
                currentStageEl.classList.remove(classToRemove);
            });
        }
    }

    /**
     * Close User Tour
     * ---------------
     */
    closeUserTour() {
        // Close stage
        this.closeCurrentStage();

        // Remove overlay
        this.el.nativeElement.querySelector('.usertour .overlay').remove();

        // Remove overflow hidden override on datagrids
        this.el.nativeElement.querySelectorAll('.datagrid-overlay-wrapper').forEach((datagrid) => {
            datagrid.classList.remove('visible');
        });

        // Save user preference
        this.userPreferenceService.saveUserPreference({ key: this.config.tourName, value: true });
    }

    /**
     * Remove Event Listeners
     * ----------------------
     * @param lastStage
     */
    removeEventListeners(lastStage) {
        const nextBtn = this.el.nativeElement.querySelector(`#${lastStage}-next-btn`);
        if (nextBtn) nextBtn.removeEventListener('click', () => this.prepNextStage());

        const prevBtn = this.el.nativeElement.querySelector(`#${lastStage}-prev-btn`);
        if (prevBtn) prevBtn.removeEventListener('click', () => this.prepPrevStage());

        const closeBtn = this.el.nativeElement.querySelector(`#close-user-tour-${lastStage}`);
        if (closeBtn) closeBtn.removeEventListener('click', () => this.closeUserTour());
    }

    ngOnDestroy() {
        this.el.nativeElement.querySelector(`#launch-btn-${this.config.tourName} .fa`)
            .removeEventListener('click', () => this.launchUserTour());
    }
}
