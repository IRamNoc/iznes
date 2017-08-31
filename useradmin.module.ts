/* Core imports. */
import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';

/* Clarity module. */
import {ClarityModule} from 'clarity-angular';

import {AdminUsersService} from '@setl/core-req-services';

/* 3rd party modules. */
import {SelectModule} from 'ng2-select';

/* Import core components. */
import {AdminWizardComponent} from './wizard/wizard.component';

/* Users components. */
import {AdminUsersComponent} from './users/users.component';

/* Wallets components. */
import {AdminWalletsComponent} from './wallets/wallets.component';
import {AdminWalletsTableComponent} from './wallets/subcomponents/wallets-table.component';

/* Permissions components. */
import {AdminPermissionsComponent} from './permissions/permissions.component';

import {PermissionGridModule} from '@setl/permission-grid';

/* User admin service. */
@NgModule({
    declarations: [
        /* Users components. */
        AdminUsersComponent,

        /* Wallets components. */
        AdminWalletsComponent,
        AdminWalletsTableComponent,

        /* Permissions components. */
        AdminPermissionsComponent,

        /* Wizard component. */
        AdminWizardComponent,
    ],
    exports: [
        /* Users components. */
        AdminUsersComponent,

        /* Wallets components. */
        AdminWalletsComponent,
        AdminWalletsTableComponent,

        /* Permissions components. */
        AdminPermissionsComponent,

        /* Wizard component. */
        AdminWizardComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        ClarityModule,
        SelectModule,
        PermissionGridModule
    ],
    providers: [ AdminUsersService ]
})

export class UserAdminModule {

}
