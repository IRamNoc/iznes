import { Component, OnInit, Input } from '@angular/core';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'datagrid-field',
    template: `
        <!-- Value with pipe -->
        <ng-container *ngIf="fieldOptions.pipe">
            <div [innerHtml]="value | dynamic: fieldOptions.pipe.name: fieldOptions.pipe.params"></div>
        </ng-container>

        <!-- Label -->
        <ng-container *ngIf="!fieldOptions.pipe && type === 'label'">
            <span class="label {{ fieldOptions.class }}">{{ value | translate }}</span>
        </ng-container>

        <!-- Value -->
        <ng-container *ngIf="!fieldOptions.pipe && type !== 'label'">
            {{ value }}
        </ng-container>`,
})

export class DatagridFieldComponent implements OnInit {

    @Input() value: string;
    @Input() type: string;
    @Input() set options(options) { this.fieldOptions = { ...options }; }

    public fieldOptions: any;

    constructor(
        public multilingual: MultilingualService,
        ) {}

    ngOnInit() {
        this.setupFieldType();
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
            if (map && map.type && map.text) {
                this.value = map.text;
                this.fieldOptions.class = map.type;
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
