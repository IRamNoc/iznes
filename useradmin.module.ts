/* Core imports. */
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgbTabsetConfig} from '@ng-bootstrap/ng-bootstrap';
import {ClarityModule} from 'clarity-angular';

/* Import core components. */
import { AdminWizardComponent } from './wizard/wizard.component';

/* Users components. */
import { AdminUsersComponent } from './users/users.component';
import { AdminUsersTableComponent } from './users/subcomponents/users-table.component';

/* Wallets components. */
import { AdminWalletsComponent } from './wallets/wallets.component';
import { AdminWalletsTableComponent } from './wallets/subcomponents/wallets-table.component';

/* Permissions components. */
import { AdminPermissionsComponent } from './permissions/permissions.component';
import { AdminPermissionsTableComponent } from './permissions/subcomponents/permissions-table.component';

/* User admin service. */
@NgModule({
    declarations: [
        AdminUsersComponent,
        AdminUsersTableComponent,

        AdminWalletsComponent,
        AdminWalletsTableComponent,

        AdminPermissionsComponent,
        AdminPermissionsTableComponent,

        AdminWizardComponent,
    ],
    exports: [
        AdminUsersComponent,
        AdminUsersTableComponent,

        AdminWalletsComponent,
        AdminWalletsTableComponent,

        AdminPermissionsComponent,
        AdminPermissionsTableComponent,

        AdminWizardComponent,
    ],
    imports: [
        NgbModule,
        CommonModule,
        BrowserModule,
        FormsModule,
        ClarityModule
    ],
    providers: [
        NgbTabsetConfig
    ]
})

export class UserAdminModule {

}
