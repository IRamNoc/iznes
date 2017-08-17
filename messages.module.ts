import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetlMessagesComponent} from './messages/messages.component';
import {ClarityModule} from 'clarity-angular';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule
    ],
    declarations: [
        SetlMessagesComponent
    ],
    exports: [
        SetlMessagesComponent
    ]
})
export class SetlMessagesModule {
}
