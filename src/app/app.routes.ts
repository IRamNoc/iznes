import {Routes} from '@angular/router';

/* Layouts. */
import {BasicLayoutComponent} from './core/layouts/basic/basic.component';
import {BlankLayoutComponent} from './core/layouts/blank/blank.component';

/* Components. */
import {HomeComponent} from './home/home.component';
import {SetlLoginComponent} from '@setl/core-login';
import {FormElementsComponent} from './ui-elements/form-elements.component';

/* UserAdmin Module. */
import {AdminUsersComponent} from '@setl/core-useradmin';
import {AdminWalletsComponent} from '@setl/core-useradmin';
import {AdminPermissionsComponent} from '@setl/core-useradmin';
import {AdminWizardComponent} from '@setl/core-useradmin';

/**
 * Asset serving module
 */
import {
    RegisterIssuerComponent,
    RegisterAssetComponent,
    IssueAssetComponent
} from '@setl/asset-servicing';

/**
 * Login Guard service
 */
import {LoginGuardService} from '@setl/core-login';
import {SetlMessagesComponent} from '@setl/core-messages';


export const ROUTES: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'ui-elements', redirectTo: 'ui-elements/form', pathMatch: 'full'},

    /* Blank layout components */
    {
        path: '', component: BlankLayoutComponent,
        children: [
            {
                path: 'login', component: SetlLoginComponent,
            }
        ]
    },

    /* Root pages. */
    {
        path: '', component: BasicLayoutComponent,
        children: [
            {
                path: 'home', component: HomeComponent, canActivate: [LoginGuardService]
            },
            {
                path: 'messages', component: SetlMessagesComponent, canActivate: [LoginGuardService]
            },
        ],
        canActivate: [LoginGuardService]
    },

    /* Ui Element Pages. */
    {
        path: 'ui-elements', component: BasicLayoutComponent,
        children: [
            {
                path: 'form', component: FormElementsComponent,
                canActivate: [LoginGuardService]
            },

        ],
        canActivate: [LoginGuardService]
    },

    /* User Admin Pages. */
    {
        path: 'asset-servicing', component: BasicLayoutComponent,
        children: [
            {path: 'register-issuer', component: RegisterIssuerComponent, canActivate: [LoginGuardService]},
            {path: 'register-asset', component: RegisterAssetComponent, canActivate: [LoginGuardService]},
            {path: 'issue-asset', component: IssueAssetComponent, canActivate: [LoginGuardService]}

        ],
        canActivate: [LoginGuardService]
    },

    /* User Admin Pages. */
    {
        path: 'user-administration', component: BasicLayoutComponent,
        children: [
            {path: 'users', component: AdminUsersComponent, canActivate: [LoginGuardService]},
            {path: 'wallets', component: AdminWalletsComponent, canActivate: [LoginGuardService]},
            {path: 'permissions', component: AdminPermissionsComponent, canActivate: [LoginGuardService]},
            {path: 'wizard', component: AdminWizardComponent, canActivate: [LoginGuardService]}

        ],
        canActivate: [LoginGuardService]
    }
];
