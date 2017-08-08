import {Routes} from '@angular/router';

/* Layouts. */
import { BasicLayoutComponent } from './layouts/basic/basic.component';
import { BlankLayoutComponent } from './layouts/blank/blank.component';

/* Components. */
import { SetlLoginComponent } from '@setl/core-login';
import { TestComComponent } from './test-com/test-com.component';

export const ROUTES: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},

    /* Blank layout components */
    {
        path: 'login', component: BlankLayoutComponent,
        children: [
            {
                path: '', component: SetlLoginComponent,
            }
        ]
    },

    /* Basic layout components */
    {
        path: 'home', component: BasicLayoutComponent,
        children: [
            {
                path: '', component: TestComComponent,
            }
        ]
    }
];
