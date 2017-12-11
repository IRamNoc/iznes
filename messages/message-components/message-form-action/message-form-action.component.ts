import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {Common, SagaHelper} from '@setl/utils';
import {WalletNodeSocketService} from '@setl/websocket-service';

import {MessageAction, MessageActionsConfig} from './message-form-action.model';
/**
 * SETL Message Action Component
 *
 * Allows for the display and use of actions within mail messages
 *
 * @uses FileViewerComponent to download display the attachment
 */
@Component({
    selector: 'setl-message-form-action',
    templateUrl: './message-form-action.component.html',
    styleUrls: ['./message-form-action.component.css']
})
export class SetlMessageFormActionComponent implements OnInit, OnDestroy {
    
    @Input() config: MessageActionsConfig;

    constructor(private ngRedux: NgRedux<any>, private walletNodeSocketService: WalletNodeSocketService) {}

    ngOnInit() {}

    ngOnDestroy() {}

    onActionClick(action: MessageAction): void {
        const request = Common.createWalletNodeSagaRequest(this.walletNodeSocketService, action.messageType, action.payload);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            action.successType,
            action.failureType,
            request,
            {},
            (data) => {
                console.log('message action success:', data);
            },
            (data) => {
                console.log('message action failed:', data);

                // error modal?
            }
        ));
    }

}
