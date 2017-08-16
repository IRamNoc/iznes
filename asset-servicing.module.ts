import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterIssuerComponent} from './register-issuer/register-issuer.component';
import {RegisterAssetComponent} from './register-asset/register-asset.component';
import {IssueAssetComponent} from './issue-asset/issue-asset.component';
import {SelectModule} from 'ng2-select';

@NgModule({
    imports: [
        CommonModule,
        SelectModule
    ],
    declarations: [
        RegisterIssuerComponent,
        RegisterAssetComponent,
        IssueAssetComponent
    ],
    exports: [
        RegisterIssuerComponent,
        RegisterAssetComponent,
        IssueAssetComponent
    ]
})
export class AssetServicingModule {
}
