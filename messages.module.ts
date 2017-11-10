import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetlMessagesComponent} from './messages/messages.component';
import {ClarityModule} from 'clarity-angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module

import {SagaHelper} from '@setl/utils';
import {NgRedux} from '@angular-redux/store';
import {Pipe, PipeTransform} from '@angular/core';
import {GravatarModule} from 'ng2-gravatar-directive';
import {SelectModule} from '@setl/utils';
import {SetlPipesModule} from '@setl/utils';

import {QuillEditorModule} from 'ngx-quill-editor';
import {MultilingualModule} from '@setl/multilingual';

import {
    MyMessagesService,
} from '@setl/core-req-services';
import {FileViewerModule} from '@setl/core-fileviewer';
import {SetlMessageAttachmentComponent} from "./messages/message-components/message-attachment/message-attachment.component";
import {SetlMessageBodyComponent} from "./messages/message-components/message-body/message-body.component";


@NgModule({
    imports: [
        CommonModule,
        ClarityModule,
        GravatarModule,
        SelectModule,
        SetlPipesModule,
        QuillEditorModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        MultilingualModule,
        FileViewerModule
    ],
    declarations: [
        SetlMessagesComponent,
        SetlMessageBodyComponent,
        SetlMessageAttachmentComponent
    ],
    exports: [
        SetlMessagesComponent,
        SetlMessageBodyComponent,
        SetlMessageAttachmentComponent
    ],
    providers: [
        MyMessagesService
    ]
})

export class SetlMessagesModule {
}
