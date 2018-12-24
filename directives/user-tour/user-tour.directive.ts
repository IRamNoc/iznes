import { Directive, ElementRef, EventEmitter, Output, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { MultilingualService } from '@setl/multilingual';
import { UserPreferenceService } from '@setl/core-req-services/user-preference/service';
import { TourConfig } from './model';
import * as _ from 'lodash';

@Directive({
    selector: '[userTour]',
    providers: [UserPreferenceService],
})

export class UserTourDirective implements AfterViewInit, OnDestroy{

    private currentStage: number = 0;

    @Input() userTour: TourConfig;
    @Output() stage: EventEmitter<any> = new EventEmitter();

    constructor(
        private el: ElementRef,
        private translate: MultilingualService,
        private userPreferenceService: UserPreferenceService,
    ) {
    }

    ngAfterViewInit() {
        this.createLaunchTrigger();
        this.handleLaunch();
    }

    /**
     * Handles when to launch the User Tour based on the config settings
     * -----------------------------------------------------------------
     */
    private handleLaunch() {
        if (this.userTour.hasOwnProperty('autostart')) {
            if (this.userTour.autostart) this.launchUserTour();
        } else {
            // Check if user has previously completed this tour
            this.userPreferenceService.getUserPreference({ key: this.userTour.tourName }).then((response) => {
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
        }
    }

    /**
     * Launches the User Tour
     * ----------------------
     */
    private launchUserTour() {
        this.currentStage = 0;

        this.el.nativeElement.classList.add('usertour');

        // Create the overlay div
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        this.el.nativeElement.insertBefore(overlay, this.el.nativeElement.firstChild);

        // Remove overflow hidden on datagrids
        this.el.nativeElement.querySelectorAll('.datagrid-overlay-wrapper').forEach((datagrid) => {
            datagrid.classList.add('visible');
        });

        // Create Tour Stage
        this.createStage(Object.keys(this.userTour.stages)[this.currentStage]);
    }

    /**
     * Create Launch Trigger
     * ---------------------
     */
    private createLaunchTrigger() {
        const existingLaunchDiv = document.querySelector('.launch-user-tour');
        let launchDiv;
        if (existingLaunchDiv) {
            launchDiv = existingLaunchDiv;
        } else {
            const triggerParentEl = document.querySelector('.router-container');
            launchDiv = document.createElement('div');
            launchDiv.classList.add('launch-user-tour');
            triggerParentEl.appendChild(launchDiv);
        }
        const trigger = document.createElement('div');
        trigger.innerHTML = `<i id="launch-btn-${this.userTour.tourName}" class="fa fa-question-circle text-primary
                                user-tour-icon"></i>`;
        launchDiv.appendChild(trigger);

        // Add click event listener to launch tour
        launchDiv.querySelector(`#launch-btn-${this.userTour.tourName}`)
            .addEventListener('click', () => this.launchUserTour());
    }

    /**
     * Creates a User Tour Stage
     * -------------------------
     * @param stage
     */
    private createStage(stage) {
        const stageEl = this.el.nativeElement.querySelector(`div #${stage}`);

        // Preserve width of child element
        if (this.userTour.stages[stage].preserveWidth) stageEl.style.width = `${stageEl.offsetWidth}px`;

        stageEl.classList.add('stage');

        // Highlight child element
        if (this.userTour.stages[stage].highlight) stageEl.classList.add('highlight');

        // Create signpost element
        const signpost = document.createElement('span');
        signpost.className = 'signpost';
        const totalStages = Object.keys(this.userTour.stages).length;
        const prevBtnHTML = this.currentStage > 0 ?
            `<button id="${stage}-prev-btn" class="btn btn-outline btn-prev">Prev</button>` : '';
        signpost.innerHTML = `
                    <i id="close-user-tour-${stage}" class="fa fa-times close-btn"></i>
                    <h2>${this.translate.translate(this.userTour.stages[stage].title)}</h2>
                    <p>${this.translate.translate(this.userTour.stages[stage].text)}</p>
                    <p class="must-complete">Please complete the action above to continue</p>
                    ${prevBtnHTML}
                    <button id="${stage}-next-btn" class="btn btn-outline btn-next">
                        ${(totalStages - 1) === this.currentStage ? 'Close' : 'Next'}</button>
                    <p class="stage-number">${this.currentStage + 1} of ${totalStages}</p>`;
        stageEl.appendChild(signpost);

        // Scroll child element into view
        stageEl.scrollIntoView();

        // Set position of signpost
        if (this.userTour.stages[stage].position) {
            stageEl.classList.add(this.userTour.stages[stage].position);
        } else {
            stageEl.classList.add(this.calculatePosition(stageEl, signpost));
        }

        // Set click event listeners for signpost buttons
        const prevBtn = this.el.nativeElement.querySelector(`#${stage}-prev-btn`);
        const nextBtn = this.el.nativeElement.querySelector(`#${stage}-next-btn`);
        const closeBtn = this.el.nativeElement.querySelector(`#close-user-tour-${stage}`);
        nextBtn.addEventListener('click', () => this.prepNextStage());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prepPrevStage());
        closeBtn.addEventListener('click', () => this.closeUserTour());
    }

    /**
     * Calculates the position of the signpost
     * --------------------------------------
     * @param stageEl
     * @param signpostEl
     * @return positionClass
     */
    private calculatePosition(stageEl, signpostEl) {
        const offset = stageEl.getBoundingClientRect();
        const right = (document.documentElement.clientWidth - stageEl.offsetWidth) - offset.left;
        const bottom = (document.documentElement.clientHeight - stageEl.offsetHeight) - offset.top;
        const sidebarWidth = document.querySelector('nav.sidenav').clientWidth;
        const topbarHeight = document.querySelector('app-navigation-topbar').clientHeight;
        const signpostHeight = signpostEl.offsetHeight;
        const signpostWidth = signpostEl.offsetWidth;

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
     * Prepares the Next Stage
     * ------------------
     */
    private prepNextStage() {
        const stageKey = Object.keys(this.userTour.stages)[this.currentStage];

        // Check if current stage is must complete
        if (this.userTour.stages[stageKey].hasOwnProperty('mustComplete')) {
            if (!this.userTour.stages[stageKey].mustComplete()) {
                const stageEl = this.el.nativeElement.querySelector(`div #${stageKey}`);
                if (stageEl) stageEl.querySelector('.must-complete').setAttribute('style', 'display: block;');
                return;
            }
        }

        this.closeCurrentStage();
        this.currentStage += 1;

        // Close user tour if this is the last stage
        if (this.currentStage === Object.keys(this.userTour.stages).length) {
            this.closeUserTour();
            return;
        }

        // Otherwise create next stage
        this.createStage(Object.keys(this.userTour.stages)[this.currentStage]);
    }

    /**
     * Prepare Previous Stage
     * ----------------------
     */
    prepPrevStage() {
        this.closeCurrentStage();
        this.currentStage -= 1;
        this.createStage(Object.keys(this.userTour.stages)[this.currentStage]);
    }

    /**
     * Closes the Current Stage
     * -------------------
     */
    closeCurrentStage() {
        const currentStage = Object.keys(this.userTour.stages)[this.currentStage];
        this.removeEventListeners(currentStage);
        const currentStageEl = this.el.nativeElement.querySelector(`#${currentStage}`);
        if (currentStageEl) {
            // Remove any classes set
            currentStageEl.lastChild.remove();
            ['top-left', 'top-middle', 'top-right', 'right-top', 'right-middle', 'right-bottom', 'bottom-left',
                'bottom-middle', 'bottom-right', 'left-top', 'left-middle', 'left-bottom', 'stage']
                .forEach((classToRemove) => {
                    currentStageEl.classList.remove(classToRemove);
                });
        }
    }

    /**
     * Closes the User Tour
     * ---------------
     */
    closeUserTour() {
        this.closeCurrentStage();

        // Remove overlay
        this.el.nativeElement.querySelector('.usertour .overlay').remove();

        // Remove overflow hidden override on datagrids
        this.el.nativeElement.querySelectorAll('.datagrid-overlay-wrapper').forEach((datagrid) => {
            datagrid.classList.remove('visible');
        });

        // Save user preference that tour is complete
        this.userPreferenceService.saveUserPreference({ key: this.userTour.tourName, value: true });
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
        document.querySelector(`#launch-btn-${this.userTour.tourName}`)
            .removeEventListener('click', () => this.launchUserTour());

        document.querySelector('.launch-user-tour').remove();
    }
}
