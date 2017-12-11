import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {Common, SagaHelper} from '@setl/utils';
import {WalletNodeSocketService} from '@setl/websocket-service';

import {MessageAction, MessageActionsConfig} from './message-action.model';
/**
 * SETL Message Action Component
 *
 * Allows for the display and use of actions within mail messages
 *
 * @uses FileViewerComponent to download display the attachment
 */
@Component({
    selector: 'setl-message-action',
    templateUrl: './message-action.component.html',
    styleUrls: ['./message-action.component.css']
})
export class SetlMessageActionComponent implements OnInit, OnDestroy {
    
    @Input() config: MessageActionsConfig;

    constructor(private ngRedux: NgRedux<any>, private walletNodeSocketService: WalletNodeSocketService) {}

    ngOnInit() {}

    ngOnDestroy() {}

    onActionClick(action: MessageAction): void {
        const request = Common.createWalletNodeSagaRequest(this.walletNodeSocketService, action.type, action.payload);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            action.successType,
            action.failureType,
            request,
            {},
            (data) => {
                console.log('do action success:', data);
            },
            (data) => {
                console.log('do action failed:', data);

                // error modal?
            }
        ));
    }

}
