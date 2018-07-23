import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultilingualModule } from '@setl/multilingual/multilingual.module';
import { DpDatePickerModule } from '../ng2-date-picker/date-picker.module';
import { SelectModule } from '../ng2-select/select.module';
import { FileDropModule } from '@setl/core-filedrop';
import { FileViewerModule } from '@setl/core-fileviewer/fileviewer.module';
import { DatePickerExtendedModule } from '../date-picker-extended/module';

import { DynamicFormComponent } from './component';
import { DynamicFormService } from './service';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MultilingualModule,
        DpDatePickerModule,
        SelectModule,
        FileDropModule,
        FileViewerModule,
        DatePickerExtendedModule,
    ],
    declarations: [
        DynamicFormComponent,
    ],
    exports: [
        DynamicFormComponent,
    ],
    providers: [
        DynamicFormService,
    ],
})
export class DynamicFormsModule {

}
