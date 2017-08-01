/* Core imports. */
import { NgModule } from "@angular/core";

/* Import core components. */
import { AdminUsersComponent } from './users/users.component';
import { AdminWalletsComponent } from './wallets/wallets.component';
import { AdminPermissionsComponent } from './permissions/permissions.component';
import { AdminWizardComponent } from './wizard/wizard.component';

/* User admin service. */

@NgModule({
    declarations: [
        AdminUsersComponent,
        AdminWalletsComponent,
        AdminPermissionsComponent,
        AdminWizardComponent
    ],
    exports: [
        AdminUsersComponent,
        AdminWalletsComponent,
        AdminPermissionsComponent,
        AdminWizardComponent
    ],
})

export class UserAdminModule {

}
