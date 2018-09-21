import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    OnDestroy,
    Renderer2,
    AfterViewInit,
    ChangeDetectorRef
} from '@angular/core';
import { ControlContainer, FormControl, FormControlDirective, FormControlName } from '@angular/forms';
import * as _ from 'lodash';
import { MultilingualService } from '@setl/multilingual';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Directive({
    selector: '[formsteps]'
})
export class FormStepsDirective implements OnInit, OnDestroy, AfterViewInit {

    private el: any;
    config: any;
    saveConfig = [];
    formstepsConstructed = false;
    isNewFormSteps = false;

    get formsteps(): any {
        return this.config;
    }

    @Input('formsteps')
    set formsteps(val) {
        this.config = val;
        if (this.saveConfig.length > 0) {
            this.isNewFormSteps = (this.config !== this.saveConfig) ? true : false;
        }
        if (this.formstepsConstructed) {
            if (this.config !== this.saveConfig) {
                this.el.style.height = (this.divSlider.offsetHeight + 260) + 'px';
                this.el.style.opacity = '0';
                setTimeout(() => {
                    this.constructFormSteps();
                }, 300);
            }
        }
        for (const conf of this.config) {
            this.saveConfig.push(_.clone(conf));
        }
    }

    isMultiForm = false;

    nbSteps = 0;
    stepSize = 0;
    currentStep: number = 0;

    divSlider: any;
    divSliderSize = 0;
    divSliderContainer: any;
    divContainer: any;
    divFinished: any;
    divProgressBar: any;
    stepDivs = [];

    divButtons: any;
    btPrev: any;
    btClose: any;
    btNext: any;
    btReset: any;
    btSubmit: any;

    forceNext = false;

    isAllFinished = false;

    constructor(
        private _el: ElementRef,
        private renderer: Renderer2,
        private _translate: MultilingualService,
        private router: Router,
        private _activatedRoute: ActivatedRoute,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        this.el = this._el.nativeElement;
        this.renderer.setStyle(this.el, 'transition', 'opacity ease-out .2s');
        this.renderer.setStyle(this.el, 'overflow', 'hidden');
    }

    @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
        if (event.keyCode === 13 || event.which === 13 || event.keyCode === 9 || event.which === 9) {
            // key Enter & TAB not allowed
            event.preventDefault();
        }
    }

    @HostListener('window:mouseup', ['$event']) onMouseUp(event: MouseEvent): void {
        setTimeout(() => {
            this.resizeHeight();
        }, 50);
    }

    @HostListener('window:resize', ['$event']) onResize(event): void {
        this.resizeWidth();
        this.resizeHeight();
    }

    ngOnInit() {
        // if (this.config) {
        //     this.constructFormSteps();
        // }
    }

    ngAfterViewInit() {
        this.constructFormSteps();
        const form = (this.isMultiForm) ? this.config[this.currentStep].form : this.config.form;
        setTimeout(() => {
            this.showHideButtons(form);
            this.resizeHeight();
            this.resizeWidth();
        }, 0);
    }

    initConfig() {
        if (this.config.length > 1 && Array.isArray(this.config)) {
            this.isMultiForm = true;

            let cpt = 0;
            for (let i in this.config) {
                if (this.config[i].form !== undefined) {
                    if (this.config[i].submitted === undefined) {
                        this.config[i].submitted = false;
                    }
                    this.config[i].form.valueChanges.subscribe((form) => this.showHideButtons(form));
                }
                if (this.config[i].startHere !== undefined && this.config[i].startHere) {
                    this.currentStep = cpt;
                }
                cpt++;
            }
        } else {
            this.config = this.config[0];
            // get forceNext if exist
            if (this.config.forceNext !== undefined && this.config.forceNext !== false) {
                this.forceNext = this.config.forceNext;
            }
            // listen to changes on form
            this.config.form.valueChanges.subscribe((form) => this.showHideButtons(this.config.form));
        }
    }

    constructFormSteps() {
        if (this.nbSteps > 0) {
            // move old sections to root
            let sections = this.divSliderContainer.getElementsByTagName('section');
            for (let i = sections.length; i > 0; i--) {
                this.el.appendChild(sections[i - 1]);
            }
            // delete old divs
            this.divSlider.remove();
            this.divButtons.remove();
            this.divContainer.remove();
            // reset steps
            this.nbSteps = 0;
            // construct all
            setTimeout(() => {
                this.constructFormSteps();
                this.resizeWidth();
                this.resizeHeight();
            }, 0);
        } else {
            this.isNewFormSteps = false;
            this.initConfig();

            // calculate nbSteps
            this.nbSteps = (this.isMultiForm) ? this.config.length : Object.keys(this.config.form.controls).length;
            this.stepSize = 100 / this.nbSteps;

            // create slider view
            this.divSlider = document.createElement('div');
            this.divSlider.className = 'fs-slider';
            this.el.appendChild(this.divSlider);

            // create slider movable container
            this.divSliderContainer = document.createElement('div');
            this.divSliderContainer.className = 'fs-slider-container';
            this.divSlider.appendChild(this.divSliderContainer);

            // step size
            this.divSliderSize = this.divSlider.offsetWidth;

            // move sections into slider container + assign step size on each section
            let sections = this.el.getElementsByTagName('section');
            for (let i = sections.length; i > 0; i--) {
                let mySection = this.el.querySelector('[order="' + i + '"]');
                if (mySection === null) {
                    this.divSliderContainer.prepend(sections[i - 1]);
                    sections[i - 1].style.width = this.divSliderSize + 'px';
                } else {
                    this.divSliderContainer.prepend(mySection);
                    mySection.style.width = this.divSliderSize + 'px';
                }
            }

            // add finish screen
            this.divFinished = document.createElement('div');
            this.divFinished.className = 'fs-slider-finished';
            this.divFinished.innerHTML = this._translate.translate('Finished!');
            this.divSliderContainer.appendChild(this.divFinished);
            this.divFinished.style.width = this.divSliderSize + 'px';

            // assign slider container size
            this.divSliderContainer.style.width = (this.divSliderSize * (this.nbSteps + 1)) + 'px'; // +1 because Finished screen

            // add steps info
            this.divContainer = document.createElement('div');
            this.divContainer.className = 'fs-container';
            this.el.insertBefore(this.divContainer, this.el.firstChild);

            this.divProgressBar = document.createElement('div');
            this.divProgressBar.className = 'fs-progressbar';
            this.divContainer.appendChild(this.divProgressBar);

            let divStep: any;
            for (let i = 0; i < this.nbSteps; i++) {
                divStep = document.createElement('div');
                divStep.style.width = this.stepSize + '%';
                if (this.currentStep === (i + 1)) {
                    divStep.className = 'fs-active';
                }
                if (this.isMultiForm) {
                    if (this.config[i].title !== undefined && this.config[i].title !== '') {
                        divStep.innerHTML = this.config[i].title;
                    }
                } else {
                    if (this.config['title' + (i + 1)] !== undefined && this.config['title' + (i + 1)] !== '') {
                        divStep.innerHTML = this.config['title' + (i + 1)];
                    }
                }
                this.divProgressBar.appendChild(divStep);
                // add click on progress bar steps to go directly to it
                // removed click on progressbar steps for the moment
                // divStep.onclick = (event) => {
                //     if (!this.isAllFinished) {
                //         // check previous
                //         let checkStep;
                //         if (this.isMultiForm) {
                //             checkStep = (i === 0) ? 0 : (i - 1);
                //             if (this.config[checkStep].form !== undefined) {
                //                 if (this.config[checkStep].form.valid) {
                //                     this.currentStep = i;
                //                     this.move();
                //                 }
                //             } else {
                //                 this.currentStep = i;
                //                 this.move();
                //             }
                //         } else {
                //             checkStep = (i === 0) ? 1 : i;
                //             if (this.config.form.controls['step' + checkStep].valid) {
                //                 this.currentStep = i;
                //                 this.move();
                //             }
                //         }
                //     }
                // };
            }

            // add buttons
            this.divButtons = document.createElement('div');
            this.divButtons.className = 'fs-buttons';
            this.el.appendChild(this.divButtons);

            // PREV
            this.btPrev = document.createElement('button');
            this.btPrev.className = 'btn btn-info btPrev';
            this.btPrev.innerHTML = 'Previous';
            this.btPrev.setAttribute('type', 'button');
            this.divButtons.appendChild(this.btPrev);
            this.btPrev.onclick = (event) => {
                if (this.config[this.currentStep] !== undefined && this.config[this.currentStep].goPrevious !== undefined) {
                    this.currentStep = this.config[this.currentStep].goPrevious - 1;
                } else {
                    this.currentStep--;
                }
                this.move();
            };

            // Close
            this.btClose = document.createElement('button');
            this.btClose.className = 'btn btn-warning btPrev';
            this.btClose.innerHTML = 'Close';
            this.btClose.setAttribute('type', 'button');
            this.divButtons.appendChild(this.btClose);
            this.btClose.onclick = (event) => {
                this.router.navigateByUrl('/my-requests/list');
            };

            // NEXT
            this.btNext = document.createElement('button');
            this.btNext.className = 'btn btn-success btNext';
            this.btNext.innerHTML = 'Next';
            this.btNext.setAttribute('type', 'button');
            this.divButtons.appendChild(this.btNext);
            this.btNext.onclick = (event) => {
                if (this.isValid()) {
                    setTimeout(() => {
                        if (this.isMultiForm) {
                            this.clickSubmit(this.btNext);

                            // if (this.config[this.currentStep].form !== undefined) {
                            //     this.config[this.currentStep].submitted = true;
                            // }
                            if (this.config[this.currentStep].goNext !== undefined) {
                                this.currentStep = this.config[this.currentStep].goNext - 1;
                            } else {
                                this.currentStep++;
                            }
                        } else {
                            this.currentStep++;
                        }
                        this.move();
                    }, 50);
                }
            };

            // SUBMIT
            this.btSubmit = document.createElement('button');
            this.btSubmit.className = 'btn btn-success btSubmit';
            this.btSubmit.innerHTML = 'Finish';
            this.divButtons.appendChild(this.btSubmit);
            this.btSubmit.onclick = (event) => {
                if (this.isValid()) {
                    this.clickSubmit(this.btSubmit);
                    // check if one step has not been done
                    const missingSteps = this.applyStepToProgressBar();
                    if (missingSteps.length > 0 && this.isMultiForm && this.config[this.nbSteps - 1].form !== undefined) {
                        setTimeout(() => {
                            // if (this.config[this.nbSteps - 1].form !== undefined) {
                            //     this.config[this.nbSteps - 1].submitted = true;
                            // }
                            this.currentStep = missingSteps[0];
                            this.move();
                        }, 50);
                    } else if (missingSteps.length > 0 && !this.isMultiForm && this.config.form !== undefined) {
                        setTimeout(() => {
                            this.currentStep = missingSteps[0];
                            this.move();
                        }, 50);
                    } else {
                        // if all ok, redirect at the end
                        let url = '';
                        if (this.isMultiForm) {
                            if (this.config[this.nbSteps - 1].redirect !== undefined && this.config[this.nbSteps - 1].redirect !== '') {
                                url = this.config[this.nbSteps - 1].redirect;
                            }
                        } else {
                            if (this.config.redirect !== undefined && this.config.redirect !== '') {
                                url = this.config.redirect;
                            }
                        }
                        if (url !== undefined && url !== '') {
                            setTimeout(() => {
                                this.router.navigateByUrl(url);
                            }, 50);
                        } else {
                            setTimeout(() => {
                                this.currentStep++;
                                this.move();
                                this.divButtons.remove();
                                this.isAllFinished = true;
                            }, 50);
                        }
                    }
                }
            };

            if (this.currentStep > 0) {
                this.move();
            }
            this.formstepsConstructed = true;

            this.renderer.setStyle(this.el, 'opacity', '1');
            this.el.style.height = null;
        }
    }

    move() {
        this.divSliderContainer.style.marginLeft = ((this.currentStep * this.divSliderSize) * -1) + 'px';
        if (this.currentStep < this.nbSteps) {
            if (this.isMultiForm) {
                if (this.config[this.currentStep].form !== undefined) {
                    this.showHideButtons(this.config[this.currentStep].form);
                } else {
                    this.showHideButtons(null);
                }
            } else {
                this.showHideButtons(this.config.form);
            }
        }
        this.resizeHeight();
        this.applyStepToProgressBar();
    }

    showHideButtons(form) {
        if (!this.isNewFormSteps) {
            if (this.nbSteps > 0) {
                // PREV
                if (this.currentStep > 0) {
                    // show
                    this.btPrev.style.display = 'inline-block';
                } else {
                    // hide
                    this.btPrev.style.display = 'none';
                }
                // NEXT
                if (this.currentStep < (this.nbSteps - 1)) {
                    // show
                    this.btNext.style.display = 'inline-block';
                    this.btSubmit.style.display = 'none';
                    // transform into submit if form
                    if (this.isMultiForm) {
                        if (this.config[this.currentStep].form !== undefined && (this.config[this.currentStep].submitted === undefined || this.config[this.currentStep].submitted === false)) {
                            this.btNext.removeAttribute('type');
                            this.btNext.dataset.form = this.config[this.currentStep].id;
                        } else {
                            this.btNext.removeAttribute('form');
                            this.btNext.setAttribute('type', 'button');
                        }
                    }
                    // SUBMIT
                } else {
                    // hide
                    this.btNext.style.display = 'none';
                    this.btSubmit.style.display = 'inline-block';
                    if (this.isMultiForm) {
                        // last step
                        if (this.config[this.nbSteps - 1].form !== undefined) {
                            if (this.config[this.nbSteps - 1].form.valid && (this.config[this.nbSteps - 1].submitted === undefined || this.config[this.nbSteps - 1].submitted === false)) {
                                this.btSubmit.dataset.form = this.config[this.nbSteps - 1].id;
                                this.btSubmit.removeAttribute('type');
                            } else {
                                this.btSubmit.removeAttribute('form');
                                this.btSubmit.setAttribute('type', 'button');
                            }
                        } else {
                            this.btSubmit.removeAttribute('form');
                            this.btSubmit.setAttribute('type', 'button');
                        }
                    } else {
                        if (this.config.form.valid && (this.config.submitted === undefined || this.config.submitted === false)) {
                            this.btSubmit.dataset.form = this.el.id;
                            this.btSubmit.removeAttribute('type');
                        } else {
                            this.btSubmit.removeAttribute('form');
                            this.btSubmit.setAttribute('type', 'button');
                        }
                    }
                }
                this.resizeHeight();
                this.applyStepToProgressBar();
            }
        } else {
            this.el.style.opacity = '0';
        }
    }

    isValid() {
        if (this.isMultiForm) {
            if (this.config[this.currentStep].form !== undefined) {
                if (this.config[this.currentStep].form.valid || (this.config[this.currentStep].submitted !== undefined && this.config[this.currentStep].submitted === true)) {
                    return true;
                } else {
                    this.dirty(this.config[this.currentStep].form.controls);
                    setTimeout(() => {
                        this.resizeHeight();
                        this.scrollToFirstError();
                    }, 50);
                    return false;
                }
            } else {
                return true;
            }
        } else {
            // NEXT
            if (this.currentStep < (this.nbSteps - 1)) {
                if (this.config.form.controls['step' + (this.currentStep + 1)].valid || (this.config.forceNext !== undefined && this.config.forceNext === true)) {
                    return true;
                } else {
                    this.dirty(this.config.form.controls['step' + (this.currentStep + 1)].controls);
                    setTimeout(() => {
                        this.resizeHeight();
                        this.scrollToFirstError();
                    }, 50);
                    return false;
                }
                // SUBMIT
            } else {
                if (this.config.form.controls['step' + (this.currentStep + 1)].valid) {
                    return true;
                } else {
                    this.dirty(this.config.form.controls['step' + (this.currentStep + 1)].controls);
                    setTimeout(() => {
                        this.resizeHeight();
                        this.scrollToFirstError();
                    }, 50);
                    return false;
                }
            }
        }
    }

    applyStepToProgressBar() {
        let missingSteps = [];
        const steps = this.divProgressBar.getElementsByTagName('div');
        for (let i = 0; i < steps.length; i++) {
            if (this.isMultiForm) {
                if (this.config[i].form !== undefined) {
                    if (this.config[i].form.valid || (this.config[i].submitted !== undefined && this.config[i].submitted === true)) {
                        steps[i].classList.add('fs-active');
                    } else {
                        steps[i].classList.remove('fs-active');
                        missingSteps.push(i);
                    }
                } else {
                    if (this.currentStep > i) {
                        steps[i].classList.add('fs-active');
                    } else {
                        steps[i].classList.remove('fs-active');
                        missingSteps.push(i);
                    }
                }
            } else {
                if (this.config.form.controls['step' + (i + 1)].valid) {
                    steps[i].classList.add('fs-active');
                } else {
                    steps[i].classList.remove('fs-active');
                    missingSteps.push(i);
                }
            }
        }
        return missingSteps;
    }

    dirty(controls) {
        Object.keys(controls).forEach((key) => {
            let formControl: FormControl = controls[key];
            if (controls[key].controls) {
                this.dirty(controls[key].controls);
            } else {
                formControl.markAsDirty();
                formControl.markAsTouched();
            }
        });

        this.changeDetectorRef.markForCheck();

        // give focus on 1st element
        const allSections = this.divSliderContainer.getElementsByTagName('section');
        const allInvalid = allSections[this.currentStep].getElementsByClassName('ng-invalid');
        for (let i = 0; i < allInvalid.length; i++) {
            if (allInvalid[i].tagName.toLocaleLowerCase() === 'input' ||
                allInvalid[i].tagName.toLocaleLowerCase() === 'textarea' ||
                allInvalid[i].tagName.toLocaleLowerCase() === 'ng-select'
            ) {
                // console.log(allInvalid[i]);
                allInvalid[i].focus();
                break;
            }
        }
    }

    scrollToFirstError() {
        let element: any;
        if (!this.isMultiForm) {
            element = document.getElementById(this.el.id).querySelector('.ng-invalid');
        } else {
            element = document.getElementById(this.config[this.currentStep].id).querySelector('.ng-invalid');
        }
        if (element) {
            this.scrollIntoView(element);
        }
    }

    scrollIntoView(element: Element) {
        const el = (element.parentNode as Element);
        const parent = document.getElementsByClassName('content-area')[0];
        if (parent) {
            parent.scrollTo(0, this.getOffset(el).top - 75); // 75 for topbar
        }
    }

    getOffset(el) {
        let _x = 0;
        let _y = 0;
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top: _y, left: _x };
    }

    resizeWidth() {
        // step size
        this.divSliderSize = this.divSlider.offsetWidth;

        // move sections into slider container + assign step size on each section
        const sections = this.el.getElementsByTagName('section');
        for (let i = sections.length; i > 0; i--) {
            sections[i - 1].style.width = this.divSliderSize + 'px';
        }
        this.divFinished.style.width = this.divSliderSize + 'px';

        // assign slider container size
        this.divSliderContainer.style.width = (this.divSliderSize * (this.nbSteps + 1)) + 'px'; // +1 because Finished screen

        this.move();
    }

    resizeHeight() {
        if (!this.isNewFormSteps) {
            const steps = this.el.getElementsByTagName('section');
            let marginsTop;
            if (steps[this.currentStep] && window.getComputedStyle(steps[this.currentStep], null)) {
                // calculate screens/sections height
                marginsTop = parseInt(window.getComputedStyle(steps[this.currentStep], null).getPropertyValue('margin').split(' ')[0].slice(0, -2)) * 2;
                this.divSlider.style.height = 10 + marginsTop + steps[this.currentStep].offsetHeight + (steps[this.currentStep].scrollHeight - steps[this.currentStep].offsetHeight) + 'px';
            } else {
                // calculate finished screen height
                marginsTop = parseInt(window.getComputedStyle(this.divFinished, null).getPropertyValue('margin').split(' ')[0].slice(0, -2)) * 2;
                this.divSlider.style.height = marginsTop + this.divFinished.offsetHeight + 'px';
            }
        } else {
            this.el.style.opacity = '0';
        }
    }

    clickSubmit(element){
        const formID = element.dataset.form;
        const form = this.divSliderContainer.querySelector('#' + formID);

        if(form){
            const formInput: HTMLElement = form.querySelector('input[type="submit"]');

            if(formInput){
                formInput.click();
            }
        }
    }

    refreshFormSteps() {
        if (!this.isNewFormSteps) {
            const form = (this.isMultiForm) ? this.config[this.currentStep].form : this.config.form;
            this.showHideButtons(form);
            this.resizeHeight();
            this.resizeWidth();
        } else {
            this.el.style.opacity = '0';
        }
    }

    ngOnDestroy(): void {

    }
}
