import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy, Renderer2, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import {ControlContainer, FormControl, FormControlDirective, FormControlName} from '@angular/forms';
import * as _ from 'lodash';
import {MultilingualService} from '@setl/multilingual';

@Directive({
    selector: '[formsteps]'
})
export class FormStepsDirective implements OnInit, OnDestroy, AfterViewInit {

    private el: any;
    @Input('formsteps') config: any;

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
    btNext: any;
    btReset: any;
    btSubmit: any;

    forceNext = false;

    isAllFinished = false;

    constructor(
        private _el: ElementRef,
        private renderer: Renderer2,
        private _translate: MultilingualService,
        private changeDetectorRef : ChangeDetectorRef,
    ) {
        this.el = this._el.nativeElement;
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
        // console.log(this.divSlider.offsetWidth);
    }

    ngOnInit() {
        if (this.config.length > 1 && Array.isArray(this.config)) {
            this.isMultiForm = true;

            for (let i in this.config) {
                if (this.config[i].form !== undefined) {
                    this.config[i].submitted = false;
                    this.config[i].form.valueChanges.subscribe((form) => this.showHideButtons(form));
                }
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
        const sections = this.el.getElementsByTagName('section');
        for (let i = sections.length; i > 0; i--) {
            this.divSliderContainer.prepend(sections[i - 1]);
            sections[i - 1].style.width = this.divSliderSize + 'px';
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
            divStep.onclick = (event) => {
                if (!this.isAllFinished) {
                    // check previous
                    let checkStep;
                    if (this.isMultiForm) {
                        checkStep = (i === 0) ? 0 : (i - 1);
                        if (this.config[checkStep].form !== undefined) {
                            if (this.config[checkStep].form.valid) {
                                this.currentStep = i;
                                this.move();
                            }
                        } else {
                            this.currentStep = i;
                            this.move();
                        }
                    } else {
                        checkStep = (i === 0) ? 1 : i;
                        if (this.config.form.controls['step' + checkStep].valid) {
                            this.currentStep = i;
                            this.move();
                        }
                    }
                }
            };
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
            this.currentStep--;
            this.move();
        };

        // NEXT
        this.btNext = document.createElement('button');
        this.btNext.className = 'btn btn-success btNext';
        this.btNext.innerHTML = 'Next';
        this.btNext.setAttribute('type', 'button');
        this.divButtons.appendChild(this.btNext);
        // if (this.isMultiForm) {
        //     if (this.config[this.currentStep].form !== undefined) {
        //         this.btNext.setAttribute('form', this.config[this.currentStep].id);
        //     } else {
        //         this.btNext.setAttribute('type', 'button');
        //     }
        // }
        this.btNext.onclick = (event) => {
            if (!this.isValid()) {
                if (this.isMultiForm) {
                    if (this.config[this.currentStep].form !== undefined) {
                        if (!this.config[this.currentStep].form.valid) {
                            this.dirty(this.config[this.currentStep].form.controls);
                            setTimeout(() => {
                                this.resizeHeight();
                                this.scrollToFirstError();
                            }, 50);

                        }
                    }
                } else {
                    if (!this.config.form.controls['step' + ((this.currentStep) + 1)].valid) {
                        this.dirty(this.config.form.controls['step' + ((this.currentStep) + 1)].controls);
                        setTimeout(() => {
                            this.resizeHeight();
                            this.scrollToFirstError();
                        }, 50);
                    }
                }
            } else {
                setTimeout(() => {
                    if (this.isMultiForm) {
                        if (this.config[this.currentStep].form !== undefined) {
                            this.config[this.currentStep].submitted = true;
                        }
                    }
                    this.currentStep++;
                    this.move();
                }, 50);
            }
        };

        // SUBMIT
        this.btSubmit = document.createElement('button');
        this.btSubmit.className = 'btn btn-success btSubmit';
        this.btSubmit.innerHTML = 'Finish';
        this.divButtons.appendChild(this.btSubmit);
        // if (!this.isMultiForm) {
        //     this.btSubmit.setAttribute('form', this.el.id);
        // } else {
        //     if (this.config[this.nbSteps - 1].form !== undefined) {
        //         this.btSubmit.setAttribute('form', this.config[this.nbSteps - 1].id);
        //     } else {
        //         this.btSubmit.setAttribute('type', 'button');
        //     }
        // }
        this.btSubmit.onclick = (event) => {
            console.log(this.isValid());
            if (!this.isValid()) {
                if (this.isMultiForm) {
                    if (this.config[this.currentStep].form !== undefined) {
                        if (!this.config[this.currentStep].form.valid) {
                            this.dirty(this.config[this.currentStep].form.controls);
                            setTimeout(() => {
                                this.resizeHeight();
                                this.scrollToFirstError();
                            }, 50);
                        }
                    }
                } else {
                    if (!this.config.form.controls['step' + ((this.currentStep) + 1)].valid) {
                        this.dirty(this.config.form.controls['step' + ((this.currentStep) + 1)].controls);
                        setTimeout(() => {
                            this.resizeHeight();
                            this.scrollToFirstError();
                        }, 50);
                    }
                }
            } else {
                setTimeout(() => {
                    this.currentStep++;
                    this.move();
                    this.divButtons.remove();
                    this.isAllFinished = true;
                }, 50);
            }
        };
    }

    ngAfterViewInit() {
        const form = (this.isMultiForm) ? this.config[this.currentStep].form : this.config.form;
        this.showHideButtons(form);
        this.resizeHeight();
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
        // PREV
        if (this.currentStep > 0) {
            // show
            this.btPrev.style.display = 'inline-block';
        } else {
            // hide
            this.btPrev.style.display = 'none';
        }
        // NEXT + SUBMIT
        if (this.currentStep < (this.nbSteps - 1)) {
            // show
            this.btNext.style.display = 'inline-block';
            this.btSubmit.style.display = 'none';
            // transform into submit if form
            if (this.isMultiForm) {
                if (this.config[this.currentStep].form !== undefined && !this.config[this.currentStep].submitted) {
                    this.btNext.removeAttribute('type');
                    this.btNext.setAttribute('form', this.config[this.currentStep].id);
                } else {
                    this.btNext.removeAttribute('form');
                    this.btNext.setAttribute('type', 'button');
                }
            }
        } else {
            // hide
            this.btNext.style.display = 'none';
            this.btSubmit.style.display = 'inline-block';
            if (this.isMultiForm) {
                if (this.config[this.nbSteps - 1].form !== undefined) {
                    if (this.config[this.nbSteps - 1].form.valid) {
                        // this.btSubmit.removeAttribute('disabled');
                        this.btSubmit.setAttribute('form', this.config[this.nbSteps - 1].id);
                    } else {
                        // this.btSubmit.setAttribute('disabled', 'disabled');
                    }
                }
            } else {
                if (this.config.form.valid) {
                    // this.btSubmit.removeAttribute('disabled');
                    this.btSubmit.setAttribute('form', this.el.id);
                } else {
                    // this.btSubmit.setAttribute('disabled', 'disabled');
                }
            }
        }

        // this.isNextDisabled();
        this.resizeHeight();
        this.applyStepToProgressBar();
    }

    isValid() {
        if (this.isMultiForm) {
            if (this.config[this.currentStep].form !== undefined) {
                if (!this.config[this.currentStep].form.valid) {
                    // this.btNext.setAttribute('disabled', 'disabled');
                    return false;
                } else {
                    // this.btNext.removeAttribute('disabled');
                    return true;
                }
            } else {
                // this.btNext.removeAttribute('disabled');
                return true;
            }
        } else {
            if (this.currentStep < (this.nbSteps - 1) && !this.forceNext) {
                if (this.config.form.controls['step' + ((this.currentStep) + 1)].valid) {
                    // this.btNext.removeAttribute('disabled');
                    return true;
                } else {
                    // this.btNext.setAttribute('disabled', 'disabled');
                    return false;
                }
            } else {
                if (this.config.form.controls['step' + ((this.currentStep) + 1)].valid) {
                    // this.btNext.removeAttribute('disabled');
                    return true;
                } else {
                    // this.btNext.setAttribute('disabled', 'disabled');
                    return false;
                }
            }
        }
    }

    applyStepToProgressBar() {
        const steps = this.divProgressBar.getElementsByTagName('div');
        for (let i = 0; i < steps.length; i++) {
            if (this.isMultiForm) {
                if (this.config[i].form !== undefined) {
                    if (this.config[i].form.valid) {
                        steps[i].classList.add('fs-active');
                    } else {
                        steps[i].classList.remove('fs-active');
                    }
                } else {
                    if (this.currentStep > i) {
                        steps[i].classList.add('fs-active');
                    } else {
                        steps[i].classList.remove('fs-active');
                    }
                }
            } else {
                if (this.config.form.controls['step' + (i + 1)].valid) {
                    steps[i].classList.add('fs-active');
                } else {
                    steps[i].classList.remove('fs-active');
                }
            }
        }
    }

    dirty(controls) {
        Object.keys(controls).forEach((key) => {
            let formControl : FormControl = controls[key];
            if (controls[key].controls) {
                this.dirty(controls[key].controls);
            } else {
                formControl.markAsDirty();
                formControl.markAsTouched();
            }
        });

        this.changeDetectorRef.markForCheck();
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

    scrollIntoView(element: Element){
        const el = (element.parentNode as Element);
        const parent = document.getElementsByClassName('content-area')[0];
        if (parent) {
            parent.scrollTo(0, this.getOffset(el).top - 100); // 75 for topbar + 25 margin :)
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

    resizeHeight() {
        const steps = this.el.getElementsByTagName('section');
        let marginsTop;
        if (steps[this.currentStep] && window.getComputedStyle(steps[this.currentStep],null)) {
            // calculate screens/sections height
            marginsTop = parseInt(window.getComputedStyle(steps[this.currentStep],null).getPropertyValue('margin').split(' ')[0].slice(0, -2)) * 2;
            // console.log('margin', marginsTop);
            // console.log('height', steps[this.currentStep].offsetHeight);
            // console.log('scroll', steps[this.currentStep].scrollHeight);
            this.divSlider.style.height = marginsTop + steps[this.currentStep].offsetHeight + (steps[this.currentStep].scrollHeight - steps[this.currentStep].offsetHeight) + 'px';
        } else {
            // calculate finished screen height
            marginsTop = parseInt(window.getComputedStyle(this.divFinished,null).getPropertyValue('margin').split(' ')[0].slice(0, -2)) * 2;
            this.divSlider.style.height = marginsTop + this.divFinished.offsetHeight + 'px';
        }
    }

    ngOnDestroy(): void {

    }
}
