import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetlMessagesComponent} from './messages/messages.component';
import {ClarityModule} from 'clarity-angular';

import {SagaHelper} from '@setl/utils';
import {NgRedux} from '@angular-redux/store';
import {Pipe, PipeTransform} from '@angular/core';
import {GravatarModule} from 'ng2-gravatar-directive';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {SelectModule} from 'ng2-select';
import {SetlPipesModule} from '@setl/utils';

import {
    MyMessagesService,
} from '@setl/core-req-services';


@NgModule({
    imports: [
        CommonModule,
        ClarityModule,
        GravatarModule,
        SelectModule,
        [
            FroalaEditorModule.forRoot(),
            FroalaViewModule.forRoot()
        ],
        SetlPipesModule
    ],
    declarations: [
        SetlMessagesComponent,
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
