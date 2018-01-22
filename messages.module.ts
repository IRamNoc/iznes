import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetlMessagesComponent} from './messages/messages.component';
import {ClarityModule} from 'clarity-angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import {SelectModule, SetlPipesModule} from '@setl/utils';
import {GravatarModule} from 'ng2-gravatar-directive';

import {QuillEditorModule} from 'ngx-quill-editor';
import {MultilingualModule} from '@setl/multilingual';

import {MessagesService} from './messages.service';
import {MyMessagesService} from '@setl/core-req-services';
import {FileViewerModule} from '@setl/core-fileviewer';
import {SetlMessageFormActionComponent} from './messages/message-components/message-form-action/message-form-action.component';
import {SetlMessageFormActionService} from './messages/message-components/message-form-action/message-form-action.service';
import {SetlMessageAttachmentComponent} from './messages/message-components/message-attachment/message-attachment.component';
import {SetlMessageBodyComponent} from './messages/message-components/message-body/message-body.component';
import {SetlMessageConnectionComponent} from './messages/message-components/message-connection/message-connection.component';
import {SetlMessageConnectionService} from './messages/message-components/message-connection/message-connection.service';

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
        SetlMessageFormActionComponent,
        SetlMessageBodyComponent,
        SetlMessageAttachmentComponent,
        SetlMessageConnectionComponent,
    ],
    exports: [
        SetlMessagesComponent,
        SetlMessageFormActionComponent,
        SetlMessageBodyComponent,
        SetlMessageAttachmentComponent,
        SetlMessageConnectionComponent
    ],
    providers: [
        MyMessagesService,
        MessagesService,
        SetlMessageFormActionService,
        SetlMessageConnectionService
    ]
})

export class SetlMessagesModule {
}
