import {
    Directive,
    ElementRef,
    ContentChildren,
    HostBinding,
    OnInit,
    OnDestroy,
    ChangeDetectorRef
} from '@angular/core';
import {
    ControlContainer,
    FormControl,
    FormControlDirective,
    FormControlName
} from '@angular/forms';
import * as _ from 'lodash';

@Directive({
    selector: '[enhancedForm]'
})
export class FormChecker implements OnInit, OnDestroy{
    el;
    form;
    submitButton;
    handleClickBind;

    @HostBinding('class.display-errors') hasErrors : boolean;
    @ContentChildren(FormControlName, {read: ElementRef}) fcnRefs;
    @ContentChildren(FormControlName) fcnInstances;

    @ContentChildren(FormControlDirective, {read: ElementRef}) fcdRefs;
    @ContentChildren(FormControlDirective) fcdInstances;

    constructor(
        elementRef : ElementRef,
        controlContainer : ControlContainer,
        private changeDetectorRef : ChangeDetectorRef
    ) {
        this.form = controlContainer.formDirective;
        this.el = elementRef.nativeElement;
    }

    get controls() {
        const fcnRefs = this.fcnRefs.toArray().map((ref : ElementRef) => ref.nativeElement);
        const fcdRefs = this.fcdRefs.toArray().map((ref : ElementRef) => ref.nativeElement);

        const fcn: Array<any> = _.zip(fcnRefs, this.fcnInstances.toArray());
        const fcd: Array<any> = _.zip(fcdRefs, this.fcdInstances.toArray());

        return fcn.concat(fcd);
    }

    ngOnInit(){
        this.submitButton = this.el.querySelector('button[type=submit]');
        this.handleClickBind = this.handleClick.bind(this);

        if(this.submitButton){
            this.initButtonEvent();
        }
    }

    initButtonEvent(){
        this.submitButton.addEventListener('click', this.handleClickBind);
    }

    handleClick(event : MouseEvent){
        if(!this.form.valid){
            event.preventDefault();
            event.stopPropagation();

            this.dirty(this.controls);
            this.findErroredElement();
        }
    }

    findErroredElement(){
        const element = this.el.querySelector('.ng-invalid');
        if(element){
            this.scrollIntoView(element);
        }
        this.hasErrors = !!element;
    }

    scrollIntoView(element: Element){
        (element.parentNode as Element).scrollIntoView();
    }

    dirty(controls){
        controls.forEach(control => {
            let formControl : FormControl = control[1].control;
            formControl.markAsDirty();
            formControl.markAsTouched();
        });

        this.changeDetectorRef.markForCheck();
    }

    ngOnDestroy(){
        this.submitButton.removeEventListener('click', this.handleClickBind);
    }
}