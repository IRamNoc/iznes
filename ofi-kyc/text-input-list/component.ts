import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

interface ContentType {
    [key: string]: {
        value: any;
        label: string;
    };
}

/**
 * This component takes a ContentType input
 * and displays it as disabled textInputs
 * in a disabled form layout
 */

@Component({
    selector: 'app-text-input-list',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
})
export class TextInputListComponent implements OnInit, OnChanges {
    @Input() title: string;
    @Input() content: ContentType;
    @Input() additionnalText: string;

    contentForm: FormGroup;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        if (this.getContentKeys().length) {
            this.contentForm = this.fb.group({
                ...this.getContentKeys().reduce(
                    (acc, cur) => {
                        acc[cur] = { value: this.content[cur].value, disabled: true };
                        return acc;
                    },
                    {},
                ),
            });
        }
    }

    getContentKeys() {
        if (!this.content) {
            return [];
        }
        return Object.keys(this.content);
    }
}
