/* Core imports. */
import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
/* Clarity module. */
import {ClarityModule} from 'clarity-angular';

import {AdminUsersService} from '@setl/core-req-services';
/* 3rd party modules. */
import {SelectModule} from '@setl/utils';
/* Import core components. */
import {AdminWizardComponent} from './wizard/wizard.component';
/* Users components. */
import {AdminUsersComponent} from './users/users.component';
/* Wallets components. */
import {AdminWalletsComponent} from './wallets/wallets.component';
/* Permissions components. */
import {AdminPermissionsComponent} from './permissions/permissions.component';

import {PermissionGridModule} from '@setl/permission-grid';
/* Manage sub-portfolio */
import {ManageSubPortfolioComponent} from './sub-portfolio/component';
/* Multilingual coolness. */
import {MultilingualModule} from '@setl/multilingual';
/* Persist Module. */
import {PersistModule} from '@setl/core-persist';

/* User admin service. */
@NgModule({
    declarations: [
        /* Users components. */
        AdminUsersComponent,

        /* Wallets components. */
        AdminWalletsComponent,

        /* Permissions components. */
        AdminPermissionsComponent,

        /* Wizard component. */
        AdminWizardComponent,

        /* Manage sub portfolio */
        ManageSubPortfolioComponent
    ],
    exports: [
        /* Users components. */
        AdminUsersComponent,

        /* Wallets components. */
        AdminWalletsComponent,

        /* Permissions components. */
        AdminPermissionsComponent,

        /* Wizard component. */
        AdminWizardComponent,

        /* Manage sub-portfolio */
        ManageSubPortfolioComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        ClarityModule,
        SelectModule,
        PermissionGridModule,
        MultilingualModule,
        PersistModule
    ],
    providers: [AdminUsersService]
})

export class UserAdminModule {

}
