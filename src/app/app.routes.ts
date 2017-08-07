import {Routes} from '@angular/router';

import {SetlLoginComponent} from '@setl/core-login';

export const ROUTES: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},

    /* Blank layout component dependant components */
    {
        path: 'login', component: SetlLoginComponent
    }
];
