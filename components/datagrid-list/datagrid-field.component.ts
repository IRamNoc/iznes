import { Component, OnInit, Input } from '@angular/core';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'datagrid-field',
    template: `
        <!-- Spacer, REMOVED AFTER VIEW INIT-->
        <div *ngIf="showColumnSpacer" class="column-spacer">{{getColumnSpaceText(value)}}</div>

        <!-- Value with pipe -->
        <ng-container *ngIf="fieldOptions.pipe">
            <div [innerHtml]="value | dynamic: fieldOptions.pipe.name: fieldOptions.pipe.params"></div>
        </ng-container>

        <!-- Label -->
        <ng-container *ngIf="!fieldOptions.pipe && type === 'label'">
            <span class="label {{ fieldOptions.class }}">{{ value | translate }}</span>
        </ng-container>

        <!-- Icon -->
        <ng-container *ngIf="!fieldOptions.pipe && type === 'icon'">
            <clr-icon [attr.shape]="fieldOptions.icon" class="icon {{ fieldOptions.class }}"></clr-icon> {{ value }}
        </ng-container>

        <!-- Value -->
        <ng-container *ngIf="!fieldOptions.pipe && type !== 'label' && type !== 'icon'">
            {{ value }}
        </ng-container>`,
})

export class DatagridFieldComponent implements OnInit {

    @Input() value: string;
    @Input() type: string;
    @Input() showColumnSpacer: boolean = true;
    @Input() set options(options) { this.fieldOptions = { ...options }; }

    public fieldOptions: any;

    constructor(
        public multilingual: MultilingualService,
        ) {}

    ngOnInit() {
        this.setupFieldType();
    }

    /**
     * Returns a single line of text to space the datagrid column correctly
     * Strips all non-alphanumeric characters and replaces them with '_'
     * @param text
     */
    public getColumnSpaceText(text: string) {
        return typeof text === 'string' ? text.replace(/[\W_]+/g, '_') : text;
    }

    setupFieldType() {
        // Handle empty pipes, default to translate
        if (typeof this.fieldOptions.pipe === 'object' && !this.fieldOptions.pipe.name) {
            this.fieldOptions.pipe.name = 'translate';
        }

        // Handle empty values
        if (typeof this.value === 'undefined') return this.setEmptyField();

        // Handle labels
        if (this.type === 'label') {
            const map = (this.fieldOptions.labelMap || {})[String(this.value)];
            if (map && map.class && map.text) {
                this.value = map.text || '';
                this.fieldOptions.class = map.class;
                this.fieldOptions.pipe = false;
                return;
            }
            return this.setEmptyField();
        }

        // Handle icons
        if (this.type === 'icon') {
            const map = (this.fieldOptions.iconMap || {})[String(this.value)];
            if (map && map.shape) {
                this.value = map.text || '';
                this.fieldOptions.icon = map.shape;
                this.fieldOptions.class = map.class;
                this.fieldOptions.pipe = false;
                return;
            }
            return this.setEmptyField();
        }
    }

    setEmptyField() {
        this.value === 'N/A';
        this.fieldOptions.pipe = { name: 'translate' };
        return;
    }
}
