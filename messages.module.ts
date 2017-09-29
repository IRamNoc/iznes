import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetlMessagesComponent} from './messages/messages.component';
import {ClarityModule} from 'clarity-angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {SagaHelper} from '@setl/utils';
import {NgRedux} from '@angular-redux/store';
import {Pipe, PipeTransform} from '@angular/core';
import {GravatarModule} from 'ng2-gravatar-directive';
import {SelectModule} from '@setl/utils';
import {SetlPipesModule} from '@setl/utils';

import {QuillEditorModule} from 'ngx-quill-editor';

import {
    MyMessagesService,
} from '@setl/core-req-services';


@NgModule({
    imports: [
        CommonModule,
        ClarityModule,
        GravatarModule,
        SelectModule,
        SetlPipesModule,
        QuillEditorModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        SetlMessagesComponent
    ],
    exports: [
        SetlMessagesComponent,
    ],
    providers: [
        MyMessagesService
    ]
})

export class SetlMessagesModule {
}
