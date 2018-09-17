import {NgModule} from '@angular/core';
import {
    VariousAddressSelectComponent,
} from './various-address-select/various-address-select.component';
import {SelectModule} from './ng2-select/select.module';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {ConfirmationComponent} from './jaspero-confirmation/confirmation.component';
import {ConfirmationsComponent} from './jaspero-confirmation/confirmations.component';
import {ConfirmationService} from './jaspero-confirmation/confirmations.service';
import {DpDatePickerModule} from './ng2-date-picker/date-picker.module';
import {SwitchButtonComponent} from './switch-button/component';
import {DatePickerExtendedModule} from './date-picker-extended/module';
import {PasswordTooltipComponent} from './passwords/tooltip.component';
import {SetlPipesModule} from '../pipes';
import {SetlDirectivesModule} from '../directives';
import {DynamicFormsModule} from './dynamic-forms/module';
import {MultilingualModule} from '@setl/multilingual/multilingual.module';
import {ClarityModule} from '@clr/angular';
import {FormstepsComponent} from './formsteps/formsteps.component';
import {FormstepComponent} from './formsteps/formstep.component';
import {ProgressComponent} from './formsteps/progress/progress.component';

@NgModule({
    declarations: [
        VariousAddressSelectComponent,
        ConfirmationsComponent,
        ConfirmationComponent,
        SwitchButtonComponent,
        PasswordTooltipComponent,
        FormstepsComponent,
        FormstepComponent,
        ProgressComponent
    ],
    exports: [
        VariousAddressSelectComponent,
        ConfirmationsComponent,
        SelectModule,
        SwitchButtonComponent,
        DatePickerExtendedModule,
        PasswordTooltipComponent,
        FormstepsComponent,
        FormstepComponent,
        ProgressComponent
    ],
    imports: [
        CommonModule,
        SelectModule,
        ReactiveFormsModule,
        SetlPipesModule,
        DpDatePickerModule,
        MultilingualModule,
        DatePickerExtendedModule,
        SetlDirectivesModule
    ],
    providers: [ConfirmationService],
})

export class SetlComponentsModule {
}
