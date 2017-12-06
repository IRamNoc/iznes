import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterIssuerComponent} from './register-issuer/register-issuer.component';
import {RegisterAssetComponent} from './register-asset/register-asset.component';
import {IssueAssetComponent} from './issue-asset/issue-asset.component';
import {SendAssetComponent} from './send-asset/send-asset.component';
import {RequestAssetComponent} from './request-asset/request-asset.component';
import {RequestTypeSelectComponent} from './request-asset/request-type-select/request-type-select.component';
import {SelectModule} from '@setl/utils';
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
        SendAssetComponent,
        RequestAssetComponent,
        RequestTypeSelectComponent
    ],
    exports: [
        RegisterIssuerComponent,
        RegisterAssetComponent,
        IssueAssetComponent,
        SendAssetComponent,
        RequestAssetComponent,
        RequestTypeSelectComponent
    ]
})
export class AssetServicingModule {
}
