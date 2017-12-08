/* Core imports. */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* Clarity module. */
import { ClarityModule } from 'clarity-angular';
/* 3rd party modules. */
import { SelectModule } from '@setl/utils';
/* Multilingual coolness. */
import { MultilingualModule } from '@setl/multilingual';
/* Connection component */
import { ConnectionComponent } from './connections/component';

import { ConnectionService } from '@setl/core-req-services';

@NgModule({
    declarations: [
        ConnectionComponent
    ],
    exports: [
        ConnectionComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        ClarityModule,
        SelectModule,
        MultilingualModule
    ],
    providers: [
        ConnectionService
    ]
})

export class ConnectionsModule {

}
