import {NgModule} from '@angular/core';
import {VariousAddressSelectComponent} from './various-address-select/various-address-select.component';
import {SelectModule} from 'ng2-select';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {ConfirmationComponent} from './jaspero-confirmation/confirmation.component';
import {ConfirmationsComponent} from './jaspero-confirmation/confirmations.component';
import {ConfirmationService} from './jaspero-confirmation/confirmations.service';


@NgModule({
    declarations: [
        VariousAddressSelectComponent,
        ConfirmationsComponent,
        ConfirmationComponent
    ],
    exports: [
        VariousAddressSelectComponent,
        ConfirmationsComponent
    ],
    imports: [
        CommonModule,
        SelectModule,
        ReactiveFormsModule
    ],
    providers: [ConfirmationService]
})

export class SetlComponentsModule {
}
