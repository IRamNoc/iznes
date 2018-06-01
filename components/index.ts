import { NgModule } from '@angular/core';
import {
    VariousAddressSelectComponent,
} from './various-address-select/various-address-select.component';
import { SelectModule } from './ng2-select/select.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmationComponent } from './jaspero-confirmation/confirmation.component';
import { ConfirmationsComponent } from './jaspero-confirmation/confirmations.component';
import { ConfirmationService } from './jaspero-confirmation/confirmations.service';
import { DpDatePickerModule } from './ng2-date-picker/date-picker.module';
import { SwitchButtonComponent } from './switch-button/component';
import { DatePickerExtendedModule } from './date-picker-extended/module';
import { SetlPipesModule } from '../pipes';
import { DynamicFormsModule } from './dynamic-forms/module';
import { MultilingualModule } from '@setl/multilingual/multilingual.module';
import { ClarityModule } from '@clr/angular';

@NgModule({
    declarations: [
        VariousAddressSelectComponent,
        ConfirmationsComponent,
        ConfirmationComponent,
        SwitchButtonComponent,
    ],
    exports: [
        VariousAddressSelectComponent,
        ConfirmationsComponent,
        SelectModule,
        SwitchButtonComponent,
        DatePickerExtendedModule,
    ],
    imports: [
        CommonModule,
        SelectModule,
        ReactiveFormsModule,
        SetlPipesModule,
        DpDatePickerModule,
        MultilingualModule,
        DatePickerExtendedModule,
    ],
    providers: [ConfirmationService],
})

export class SetlComponentsModule {
}
