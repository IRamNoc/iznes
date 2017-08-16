import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetlMessagesComponent} from './messages/messages.component';

@NgModule({
    imports: [
        CommonModule
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
