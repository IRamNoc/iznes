/* Core imports. */
import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';

/* Clarity module. */
import {ClarityModule} from 'clarity-angular';

/* Components. */
import {PermissionGridComponent} from './permission-grid/permission-grid.component';
import {OptionListComponent} from './option-list/option-list.component';

/* Services. */
import {OptionListService} from './option-list/option-list.service';

/* User admin service. */
@NgModule({
    declarations: [
        PermissionGridComponent,
        OptionListComponent
    ],
    exports: [
        PermissionGridComponent,
        OptionListComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        ClarityModule,
    ],
    providers: [ OptionListService ]
})

export class PermissionGridModule {

}
