import { Component, ContentChild, HostBinding, ElementRef, OnDestroy } from '@angular/core';

@Component({
    selector : 'form-step',
    template : '<ng-content></ng-content>',
})
export class FormstepComponent implements OnDestroy {

    @ContentChild('step') step;
    @HostBinding('class') classname = 'steps-slide';
    @HostBinding('class.active') active = false;
    @HostBinding('attr.tabindex') tabIndex = '-1'; // stop tabbing between formsteps

    elementsWithListeners: any[] = [];

    constructor(
        private element: ElementRef,
    ) {}

    /**
     * Stops the steps last input from tabbing to the first input of the next step and breaking the UI
     */
    public stopLastInputTabbing() {
        this.findLastInputs();
    }

    /**
     * Find the last input(s) on this form step and pass to add keydown listener
     */
    private findLastInputs() {
        const elements = this.element.nativeElement.querySelectorAll(`
            input[type=text],
            input[type=checkbox],
            input[type=radio],
            input[type=number],
            ng-select .ui-select-container,
            setl-file-drop .drop-file-zone
        `);

        if (elements.length) {
            const lastInput = elements[elements.length - 1];

            // Handle radio input groups
            if (lastInput.getAttribute('type') === 'radio') {
                this.element.nativeElement.querySelectorAll(`
                    input[name=${lastInput.getAttribute('name')}]
                `).forEach(el => this.addKeydownListener(el));
                return;
            }

            this.addKeydownListener(lastInput);
        }
    }

    /**
     * Call stopElementTabbing function on elements keydown
     * @param el {HTMLElement} Element to add keydown listner to
     */
    private addKeydownListener(el) {
        this.elementsWithListeners.push(el);
        el.addEventListener('keydown', e => this.stopElementTabbing(e));
    }

    /**
     * Prevent default behaviour if tab key pressed
     * @param e {object} Keydown event object
     */
    private stopElementTabbing(e) {
        e.stopPropagation();
        if (e.keyCode === 9) e.preventDefault();
    }

    /**
     * Remove all keydown event listeners using the elementsWithListeners array
     */
    private removeKeydownListeners() {
        this.elementsWithListeners.forEach(el => el.removeEventListener('keydown', e => this.stopElementTabbing(e)));
        this.elementsWithListeners = [];
    }

    ngOnDestroy() {
        this.removeKeydownListeners();
    }
}
