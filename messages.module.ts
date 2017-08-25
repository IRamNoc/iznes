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

import {
    MyMessagesService,
} from '@setl/core-req-services';


@Pipe({
    name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, args: string[]): string {
        const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
        const trail = args.length > 1 ? args[1] : '...';
        return value.length > limit ? value.substring(0, limit).trim() + trail : value;
    }
}

@NgModule({
    imports:
        [
            CommonModule,
            ClarityModule,
            GravatarModule,
            SelectModule,
            [
                FroalaEditorModule.forRoot(),
                FroalaViewModule.forRoot()
            ],
        ],
    declarations:
        [
            SetlMessagesComponent,
            TruncatePipe
        ],
    exports:
        [
            SetlMessagesComponent,
            TruncatePipe
        ],
    providers:
        [
            MyMessagesService
        ]
})

export class SetlMessagesModule {
}
