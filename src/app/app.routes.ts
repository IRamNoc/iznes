import {Routes} from '@angular/router';

/* Layouts. */
import {BasicLayoutComponent} from './core/layouts/basic/basic.component';
import {BlankLayoutComponent} from './core/layouts/blank/blank.component';

/* Components. */
import {HomeComponent} from './home/home.component';
import {SetlLoginComponent} from '@setl/core-login';
import {FormElementsComponent} from './ui-elements/form-elements.component';


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
                path: 'home', component: HomeComponent,
            },
        ]
    },

    /* Ui Element Pages. */
    {
        path: 'ui-elements', component: BasicLayoutComponent,
        children: [
            {
                path: 'form', component: FormElementsComponent,
            },

        ]
    }
];
