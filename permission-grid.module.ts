/* Core imports. */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

/* Clarity module. */
import { ClarityModule } from '@clr/angular';

/* Components. */
import { PermissionGridComponent } from './permission-grid/permission-grid.component';
import { MenuPermissionGridComponent } from './menu-permission-grid/menu-permission-grid.component';
import { MenuOptionListComponent } from './menu-option-list/menu-option-list.component';

/* Services. */
import { MenuOptionListService } from './menu-option-list/menu-option-list.service';

/* Directives. */
import { SetlDirectivesModule } from '@setl/utils/directives';

/* User admin service. */
@NgModule({
    declarations: [
        PermissionGridComponent,
        MenuPermissionGridComponent,
        MenuOptionListComponent,
    ],
    exports: [
        PermissionGridComponent,
        MenuPermissionGridComponent,
        MenuOptionListComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        ClarityModule,
        SetlDirectivesModule,
    ],
    providers: [
        MenuOptionListService,
    ],
})

export class PermissionGridModule {

}
