import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {NumberFormatterDirective} from './number-formatter/directive';
import {ClrDgIconSortDirective} from './clr-dg-sort-icon/directive';
import {HighlightDirective} from './highlight/highlight.directive';
import {ClickedDirective} from './clicked/clicked.directive';
import {MoneyValuePipe} from '../pipes';


@NgModule({
    declarations: [
        NumberFormatterDirective,
        ClrDgIconSortDirective,
        HighlightDirective,
        ClickedDirective,
    ],
    exports: [
        NumberFormatterDirective,
        ClrDgIconSortDirective,
        HighlightDirective,
        ClickedDirective,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    providers: [MoneyValuePipe]
})

export class SetlDirectivesModule {

}
