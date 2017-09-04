import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterIssuerComponent} from './register-issuer/register-issuer.component';
import {RegisterAssetComponent} from './register-asset/register-asset.component';
import {IssueAssetComponent} from './issue-asset/issue-asset.component';
import {SelectModule} from 'ng2-select';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {ClarityModule} from 'clarity-angular';
import {SetlPipesModule, SetlComponentsModule} from '@setl/utils';


@NgModule({
    imports: [
        CommonModule,
        SelectModule,
        FormsModule,
        ReactiveFormsModule,
        ClarityModule.forRoot(),
        SetlPipesModule,
        SetlComponentsModule
    ],
    declarations: [
        RegisterIssuerComponent,
        RegisterAssetComponent,
        IssueAssetComponent,
    ],
    exports: [
        RegisterIssuerComponent,
        RegisterAssetComponent,
        IssueAssetComponent
    ]
})
export class AssetServicingModule {
}
