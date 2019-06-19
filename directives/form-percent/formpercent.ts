import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';

@Directive({
    selector: '[formpercent]'
})
export class FormPercentDirective implements OnInit, OnDestroy, AfterViewInit {

    @Input('formpercent') config: any;
    private el: any;
    private allFields = [];
    private divPG: any;

    constructor(
        private element: ElementRef,
    ) {
        this.el = this.element.nativeElement;
    }

    ngOnInit() {
        console.log('+++ this.config.form', this.config.form);
        // count all field into form & formgroup
        this.iterateForm(this.config.form.controls, 'push', '');
        // listen to changes
        this.config.form.valueChanges.subscribe(form => this.iterateForm(this.config.form.controls, 'check', ''));

        this.constructProgressBar();
    }

    ngAfterViewInit() {
    }

    iterateForm(controls, action, groupname) {
        Object.keys(controls).forEach((key) => {
            if (!controls[key].disabled) { // not check or push disabled fields

                if (controls[key].controls) {
                    if (controls[key].validator) {
                        if (action === 'push') {
                            this.allFields[groupname + key] = { field: groupname + key, valid: false };
                        }
                        if (action === 'check' && this.allFields[groupname + key] !== undefined) {
                            if (this.allFields[groupname + key].hasOwnProperty('valid')) {
                                this.allFields[groupname + key].valid = controls[key].valid;
                            }
                        }
                    } else {
                        this.iterateForm(controls[key].controls, action, key);
                    }
                } else {
                    const hasRequired =
                        _.isFunction(controls[key].validator) && _.get(controls[key].validator({}), 'required');

                    if (hasRequired) {
                        if (action === 'push') {
                            this.allFields[groupname + key] = { field: groupname + key, valid: false };
                        }
                        if (action === 'check' && this.allFields[groupname + key] !== undefined) {
                            if (this.allFields[groupname + key].hasOwnProperty('valid')) {
                                this.allFields[groupname + key].valid = controls[key].valid;
                            }
                        }
                    }

                }
            }
        });

        // Filter allFields if a subform is passed in
        if (this.config.subform) {
            const matching = [];

            Object.keys(this.allFields).forEach((field) => {
                if (Object.keys(this.config.subform.controls).includes(field)) {
                    matching[field] = this.allFields[field];
                }
            });

            this.allFields = matching;
        }

        if (action === 'check') {
            this.calculatePercent();
        }
    }

    constructProgressBar() {
        this.divPG = document.createElement('div');
        this.divPG.className = 'label';
        this.divPG.classList.add('label-danger');
        this.divPG.innerHTML = '0%';
        this.el.appendChild(this.divPG);
    }

    calculatePercent() {
        let total: any = 0;
        let valid: any = 0;
        Object.keys(this.allFields).forEach((key) => {
            total += 1;
            if (this.allFields[key].valid) {
                valid += 1;
            }
        });

        let percent;
        if (!total) {
            percent = 100;
        } else {
            percent = Math.round(valid * 100 / total);
        }

        this.divPG.innerHTML = `${percent}%`;

        if (percent === 100) {
            this.changeLabelColourClass('label-success');
        } else if (percent === 0) {
            this.changeLabelColourClass('label-danger');
        } else {
            this.changeLabelColourClass('label-warning');
        }
    }

    changeLabelColourClass(cssClass) {
        this.divPG.classList = 'label';
        this.divPG.classList.add(cssClass);
    }

    refreshFormPercent() {
        this.allFields = []; // reset
        if (this.config) {
            this.iterateForm(this.config.form.controls, 'push', ''); // re-parse
            this.iterateForm(this.config.form.controls, 'check', ''); // re-check
        }
    }

    ngOnDestroy(): void {

    }
}
