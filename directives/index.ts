import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {NumberFormatterDirective} from './number-formatter/directive';
import {ClrDgIconSortDirective} from './clr-dg-sort-icon/directive';
import {HighlightDirective} from './highlight/highlight.directive';
import {MoneyValuePipe} from '../pipes';


@NgModule({
    declarations: [
        NumberFormatterDirective,
        ClrDgIconSortDirective,
        HighlightDirective
    ],
    exports: [
        NumberFormatterDirective,
        ClrDgIconSortDirective,
        HighlightDirective
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    providers: [MoneyValuePipe]
})

export class SetlDirectivesModule {

}
