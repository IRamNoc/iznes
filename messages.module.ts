import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetlMessagesComponent } from './messages/messages.component';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { SelectModule, SetlPipesModule } from '@setl/utils';
import { GravatarModule } from 'ng2-gravatar-directive';

import { QuillEditorModule } from 'ngx-quill-editor';
import { MultilingualModule } from '@setl/multilingual';

import { MessagesService } from './messages.service';
import { MyMessagesService } from '@setl/core-req-services';
import { FileViewerModule } from '@setl/core-fileviewer';
import { SetlMessageFormActionComponent } from './messages/message-components/message-form-action/message-form-action.component';
import { SetlMessageFormActionService } from './messages/message-components/message-form-action/message-form-action.service';
import { SetlMessageAttachmentComponent } from './messages/message-components/message-attachment/message-attachment.component';
import { SetlMessageBodyComponent } from './messages/message-components/message-body/message-body.component';
import { SetlMessageConnectionComponent } from './messages/message-components/message-connection/message-connection.component';
import { SetlMessageConnectionService } from './messages/message-components/message-connection/message-connection.service';
import { SetlMessageKycComponent } from './messages/message-components/message-kyc/message-kyc.component';
import { SetlMessageAmCancelOrderComponent } from './messages/message-components/message-cancel-order/message-cancel-order.component';
import { RouterModule } from '@angular/router';

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
        FileViewerModule,
        RouterModule,
    ],
    declarations: [
        SetlMessagesComponent,
        SetlMessageFormActionComponent,
        SetlMessageBodyComponent,
        SetlMessageAttachmentComponent,
        SetlMessageConnectionComponent,
        SetlMessageKycComponent,
        SetlMessageAmCancelOrderComponent,
    ],
    exports: [
        SetlMessagesComponent,
        SetlMessageFormActionComponent,
        SetlMessageBodyComponent,
        SetlMessageAttachmentComponent,
        SetlMessageConnectionComponent,
        SetlMessageKycComponent,
        SetlMessageAmCancelOrderComponent,
    ],
    providers: [
        MyMessagesService,
        MessagesService,
        SetlMessageFormActionService,
        SetlMessageConnectionService,
    ],
})

export class SetlMessagesModule {
}
