import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {FormItem, FormItemType} from './DynamicForm';
import {DynamicFormService} from './service';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-dynamic-form',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DynamicFormComponent implements OnInit {

    private _model;
    @Input() set model(model: { [key: string]: FormItem }) {
        this._model = model;
        this.generateForm();
    }
    get model() { return this._model; }

    form: FormGroup;

    constructor(private service: DynamicFormService) {}

    ngOnInit() {}

    private generateForm(): void {
        this.form = this.service.generateForm(this._model);
        this.service.updateModel(this._model, this.form);
    }

}