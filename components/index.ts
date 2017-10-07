import {NgModule} from '@angular/core';
import {VariousAddressSelectComponent} from './various-address-select/various-address-select.component';
import {SelectModule} from './ng2-select/select.module';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {ConfirmationComponent} from './jaspero-confirmation/confirmation.component';
import {ConfirmationsComponent} from './jaspero-confirmation/confirmations.component';
import {ConfirmationService} from './jaspero-confirmation/confirmations.service';
import {SwitchButtonComponent} from './switch-button/component';
import {SetlPipesModule} from '../pipes';


@NgModule({
    declarations: [
        VariousAddressSelectComponent,
        ConfirmationsComponent,
        ConfirmationComponent,
        SwitchButtonComponent
    ],
    exports: [
        VariousAddressSelectComponent,
        ConfirmationsComponent,
        SelectModule,
        SwitchButtonComponent
    ],
    imports: [
        CommonModule,
        SelectModule,
        ReactiveFormsModule,
        SetlPipesModule
    ],
    providers: [ConfirmationService]
})

export class SetlComponentsModule {
}
