import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {NumberFormatterDirective} from './number-formatter/directive';
import {MoneyValuePipe} from '../pipes';


@NgModule({
    declarations: [
        NumberFormatterDirective
    ],
    exports: [
        NumberFormatterDirective
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    providers: [MoneyValuePipe]
})

export class SetlDirectivesModule {
}
