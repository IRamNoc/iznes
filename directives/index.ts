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

import {TooltipDirective} from './tooltip/tooltip.directive';
import {FormStepsDirective} from './form-steps/formsteps';
import {FormPercentDirective} from './form-percent/formpercent';
import {ActiveHeaderButtonDirective} from './activeHeaderButton/active-header-button.directive';
import {ClrDgRowClickableDirective} from './clr-dg-row-clickable/directive';
import {MoneyValuePipe} from '../pipes';

@NgModule({
    declarations: [
        NumberFormatterDirective,
        ClrDgIconSortDirective,
        ClrDgSortNoSearchDirective,
        ClrDgRowClickableDirective,
        HighlightDirective,
        ClickedDirective,
        BackToTopDirective,
        FormChecker,
        TooltipDirective,
        FormStepsDirective,
        FormPercentDirective,
        ActiveHeaderButtonDirective,
    ],
    exports: [
        NumberFormatterDirective,
        ClrDgIconSortDirective,
        ClrDgSortNoSearchDirective,
        ClrDgRowClickableDirective,
        HighlightDirective,
        ClickedDirective,
        BackToTopDirective,
        FormChecker,
        TooltipDirective,
        FormStepsDirective,
        FormPercentDirective,
        ActiveHeaderButtonDirective,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    providers: [MoneyValuePipe],
})

export class SetlDirectivesModule {

}
