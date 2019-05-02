/* Core imports. */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* Clarity module. */
import { ClarityModule } from '@clr/angular';
/* 3rd party modules. */
import { SelectModule, SetlPipesModule } from '@setl/utils';
/* Multilingual coolness. */
import { MultilingualModule } from '@setl/multilingual';
/* Connection component */
import { ConnectionComponent } from './connections/component';

import { ConnectionService } from '@setl/core-req-services';

import { DatagridListModule } from '@setl/utils/components/datagrid-list/datagrid-list-module';

@NgModule({
    declarations: [
        ConnectionComponent,
    ],
    exports: [
        ConnectionComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        ClarityModule,
        SelectModule,
        SetlPipesModule,
        MultilingualModule,
        DatagridListModule,
    ],
    providers: [
        ConnectionService,
    ],
})

export class ConnectionsModule {

}
