import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultilingualModule } from '@setl/multilingual/multilingual.module';
import { SetlPipesModule } from '../../pipes';
import { DpDatePickerModule } from '../ng2-date-picker/date-picker.module';

import { DatePickerExtendedComponent } from './component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MultilingualModule,
        DpDatePickerModule,
        SetlPipesModule,
    ],
    declarations: [
        DatePickerExtendedComponent,
    ],
    exports: [
        DatePickerExtendedComponent,
    ],
})
export class DatePickerExtendedModule { }
