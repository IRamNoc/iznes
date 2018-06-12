import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy, Renderer2, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import {MultilingualService} from '@setl/multilingual';

@Directive({
    selector: '[formpercent]'
})
export class FormPercentDirective implements OnInit, OnDestroy, AfterViewInit {

    @Input('formpercent') config: any;
    private el: any;
    private allFields = [];
    private divPG: any;
    private divIcon: any;
    private divProgressBarContainer: any;
    private divProgressBarType: any;
    private divProgressBarColor: any;
    private divProgressBarLabel: any;
    private colorBar: any;
    private colorBarIcon: any;

    private types = [];
    private colors = [];

    constructor(
        private _el: ElementRef,
        private renderer: Renderer2,
        private _translate: MultilingualService,
    ) {
        this.el = this._el.nativeElement;
        this.types['square'] = 'progressSquare';
        this.types['round'] = 'progressRounded';
        this.types['border'] = 'progressBordered';
        this.colors['info'] = 'cssProgress-info';
        this.colors['warning'] = 'cssProgress-warning';
        this.colors['danger'] = 'cssProgress-danger';
        this.colors['success'] = 'cssProgress-success';
    }

    ngOnInit() {
        let cpt = 0;
        // count all field into form & formgroup
        this.iterateForm(this.config.form.controls, 'push');
        // listen to changes
        this.config.form.valueChanges.subscribe((form) => this.iterateForm(this.config.form.controls, 'check'));

        this.constructProgressBar();
    }

    ngAfterViewInit() {
    }

    iterateForm(controls, action) {
        const nbControls = Object.keys(controls).length;

        Object.keys(controls).forEach((key) => {
            if (controls[key].controls) {
                if (action === 'push') this.iterateForm(controls[key].controls, 'push');
                if (action === 'check') this.iterateForm(controls[key].controls, 'check');
            } else {
                if (action === 'push') {
                    this.allFields[key] = { field: key, valid: false };
                }
                if (action === 'check') {
                    if (controls[key].valid) {
                        this.allFields[key].valid = true;
                    } else {
                        this.allFields[key].valid = false;
                    }
                }
            }
        });

        if (action === 'check') {
            this.calculatePercent();
        }
    }

    constructProgressBar() {
        this.colorBar = (this.config.color === undefined) ? 'cssProgress-success' : (this.colors[this.config.color] !== undefined) ? this.colors[this.config.color] : 'cssProgress-success';
        // this.colorBarIcon = this.colorBar.replace('cssProgress', 'cssProgressIcon');

        this.divPG = document.createElement('div');
        this.divPG.className = 'divPG';
        this.el.appendChild(this.divPG);

        this.divIcon = document.createElement('div');
        this.divIcon.className = 'divPGIcon';
        this.divIcon.innerHTML = '<i class="fa fa-exclamation-circle cssProgressIcon-danger"></i>';
        this.el.appendChild(this.divIcon);

        this.divPG.style.width = 'calc(100% - ' + (this.divIcon.offsetWidth + 4) + 'px)'; // +4 BECAUSE ICON CHECK LAGER THAN TIMER

        this.divProgressBarContainer = document.createElement('div');
        this.divProgressBarContainer.className = 'cssProgress';
        this.divPG.appendChild(this.divProgressBarContainer);

        this.divProgressBarType = document.createElement('div');
        this.divProgressBarType.className = (this.config.type === undefined) ? 'progressBordered' : (this.types[this.config.type] !== undefined) ? this.types[this.config.type] : 'progressBordered';
        this.divProgressBarContainer.appendChild(this.divProgressBarType);

        this.divProgressBarColor = document.createElement('div');
        this.divProgressBarColor.className = 'cssProgress-bar';
        this.divProgressBarType.appendChild(this.divProgressBarColor);

        // is animated
        if (this.config.animated === undefined || this.config.animated === true) {
            this.divProgressBarColor.classList.add('cssProgress-active');
        } else {
            if ((this.config.animated !== undefined && this.config.animated === false) && (this.config.stripes !== undefined && this.config.stripes === true)) {
                this.divProgressBarColor.classList.add('cssProgress-stripes');
            }
        }
        // bar color
        this.divProgressBarColor.classList.add(this.colorBar);

        this.divProgressBarLabel = document.createElement('span');
        this.divProgressBarLabel.className = 'cssProgress-label';
        this.divProgressBarLabel.innerHTML = 0 + '%';
        this.divProgressBarColor.appendChild(this.divProgressBarLabel);
    }

    calculatePercent() {
        let total: any = 0;
        let valid: any = 0;
        Object.keys(this.allFields).forEach((key) => {
            total++;
            if (this.allFields[key].valid) {
                valid++;
            }
        });
        const percent = Math.round(valid * 100 / total);
        this.divProgressBarColor.style.width = percent + '%';
        this.divProgressBarLabel.innerHTML = percent + '%';

        if (percent === 100) {
            this.divIcon.innerHTML = '<i class="fa fa-check cssProgressIcon-success"></i>';
        } else if (percent === 0) {
            this.divIcon.innerHTML = '<i class="fa fa-exclamation-circle cssProgressIcon-danger"></i>';
        } else {
            this.divIcon.innerHTML = '<i class="fa fa-hourglass-half cssProgressIcon-warning"></i>';
        }
    }

    ngOnDestroy(): void {

    }
}
