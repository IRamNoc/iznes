/* Core imports. */
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

/* Import core components. */

import { AdminPermissionsComponent } from './permissions/permissions.component';
import { AdminWizardComponent } from './wizard/wizard.component';

/* Users components. */
import { AdminUsersComponent } from './users/users.component';
import { AdminUsersTableComponent } from './users/subcomponents/users-table.component';

/* Wallets components. */
import { AdminWalletsComponent } from './wallets/wallets.component';
import { AdminWalletsTableComponent } from './wallets/subcomponents/wallets-table.component';

/* User admin service. */

@NgModule({
    declarations: [
        AdminUsersComponent,
        AdminUsersTableComponent,

        AdminWalletsComponent,
        AdminWalletsTableComponent,

        AdminPermissionsComponent,

        AdminWizardComponent,
    ],
    exports: [
        AdminUsersComponent,
        AdminWalletsComponent,

        AdminPermissionsComponent,
        AdminWalletsTableComponent,

        AdminWizardComponent,

        AdminUsersTableComponent
    ],
    imports: [
        NgbModule,
        CommonModule,
        BrowserModule
    ]
})

export class UserAdminModule {

}
