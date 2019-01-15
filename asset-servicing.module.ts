import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterIssuerComponent } from './register-issuer/register-issuer.component';
import { RegisterAssetComponent } from './register-asset/register-asset.component';
import { IssueAssetComponent } from './issue-asset/issue-asset.component';
import { SendAssetComponent } from './send-asset/send-asset.component';
import { VoidAssetComponent } from './void-asset/void-asset.component';
import { RequestAssetComponent } from './request-asset/request-asset.component';
import { RequestTypeSelectComponent } from './request-asset/request-type-select/request-type-select.component';
import { EncumberAssetsComponent } from './encumber-assets/component';
import { UnencumberAssetsComponent } from './unencumber-assets/component';
import { SelectModule } from '@setl/utils';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { SetlPipesModule, DpDatePickerModule, SetlComponentsModule, SetlDirectivesModule } from '@setl/utils';

@NgModule({
    imports: [
        CommonModule,
        SelectModule,
        FormsModule,
        ReactiveFormsModule,
        ClarityModule.forRoot(),
        SetlPipesModule,
        DpDatePickerModule,
        SetlComponentsModule,
        SetlDirectivesModule,
    ],
    declarations: [
        RegisterIssuerComponent,
        RegisterAssetComponent,
        IssueAssetComponent,
        VoidAssetComponent,
        SendAssetComponent,
        RequestAssetComponent,
        RequestTypeSelectComponent,
        EncumberAssetsComponent,
        UnencumberAssetsComponent,
    ],
    exports: [
        RegisterIssuerComponent,
        RegisterAssetComponent,
        IssueAssetComponent,
        VoidAssetComponent,
        SendAssetComponent,
        RequestAssetComponent,
        RequestTypeSelectComponent,
        EncumberAssetsComponent,
        UnencumberAssetsComponent,
    ],
})
export class AssetServicingModule {
}
