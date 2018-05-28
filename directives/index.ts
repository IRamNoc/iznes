import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {NumberFormatterDirective} from './number-formatter/directive';
import {ClrDgIconSortDirective} from './clr-dg-sort-icon/directive';
import {ClrDgSortNoSearchDirective} from './clr-dg-sort-nosearch/directive';
import {HighlightDirective} from './highlight/highlight.directive';
import {ClickedDirective} from './clicked/clicked.directive';
import {BackToTopDirective} from './back-to-top/back-to-top.directive';
import {FormChecker} from './enhanced-form/enhanced-form.directive';

import {MoneyValuePipe} from '../pipes';


@NgModule({
    declarations: [
        NumberFormatterDirective,
        ClrDgIconSortDirective,
        ClrDgSortNoSearchDirective,
        HighlightDirective,
        ClickedDirective,
        BackToTopDirective,
        FormChecker
    ],
    exports: [
        NumberFormatterDirective,
        ClrDgIconSortDirective,
        ClrDgSortNoSearchDirective,
        HighlightDirective,
        ClickedDirective,
        BackToTopDirective,
        FormChecker
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    providers: [MoneyValuePipe]
})

export class SetlDirectivesModule {

}
