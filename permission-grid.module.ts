/* Core imports. */
import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';

/* Clarity module. */
import {ClarityModule} from '@clr/angular';

/* Components. */
import {PermissionGridComponent} from './permission-grid/permission-grid.component';
import {OptionListComponent} from './option-list/option-list.component';
import {MenuPermissionGridComponent} from './menu-permission-grid/menu-permission-grid.component';
import {MenuOptionListComponent} from './menu-option-list/menu-option-list.component';

/* Services. */
import {OptionListService} from './option-list/option-list.service';
import {MenuOptionListService} from './menu-option-list/menu-option-list.service';

/* User admin service. */
@NgModule({
    declarations: [
        PermissionGridComponent,
        MenuPermissionGridComponent,
        OptionListComponent,
        MenuOptionListComponent
    ],
    exports: [
        PermissionGridComponent,
        MenuPermissionGridComponent,
        OptionListComponent,
        MenuOptionListComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        ClarityModule,
    ],
    providers: [
        OptionListService,
        MenuOptionListService
    ]
})

export class PermissionGridModule {

}
