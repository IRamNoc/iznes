import {NgModule} from '@angular/core';
import {VariousAddressSelectComponent} from './various-address-select/various-address-select.component';
import {SelectModule} from 'ng2-select';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        VariousAddressSelectComponent
    ],
    exports: [
        VariousAddressSelectComponent
    ],
    imports: [
        CommonModule,
        SelectModule,
        ReactiveFormsModule
    ]
})

export class SetlComponentsModule {
}
