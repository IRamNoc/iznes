/* Core/Angular imports. */
import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';

/* Clarity module. */
import {ClarityModule} from '@clr/angular';

/* Components. */
import {CreateResolutionComponent} from './create-resolution/create-resolution.component';
import {IssueResolutionComponent} from './issue-resolution/issue-resolution.component';
import {DistributionComponent} from './distribution/distribution.component';
import {MergerAbsorptionComponent} from './merger-absorption/merger-absorption.component';
import {SplitComponent} from './split/split.component';

/* Decorator. */
@NgModule({
    declarations: [
        CreateResolutionComponent,
        IssueResolutionComponent,
        DistributionComponent,
        MergerAbsorptionComponent,
        SplitComponent
    ],
    exports: [
        CreateResolutionComponent,
        IssueResolutionComponent,
        DistributionComponent,
        MergerAbsorptionComponent,
        SplitComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        ClarityModule
    ],
    providers: []
})

/* Class. */
export class CorpActionsModule {

}
