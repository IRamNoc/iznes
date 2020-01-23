import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { Common, SagaHelper } from '@setl/utils';
import { WalletNodeSocketService } from '@setl/websocket-service';
import { MessagesService } from '../../../messages.service';
import { MessageAction, MessageActionsConfig } from './message-form-action.model';
import { SetlMessageFormActionService } from './message-form-action.service';
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
    styleUrls: ['./message-form-action.component.css'],
})
export class SetlMessageFormActionComponent implements OnInit, OnDestroy {
    @Input() config: MessageActionsConfig;
    @Input() isActed: boolean;
    @Input() walletId: number;
    @Input() mailId: number;

    constructor(private service: SetlMessageFormActionService) {}

    ngOnInit() {}

    ngOnDestroy() {}

    onActionClick(action: MessageAction): void {
        this.service.doAction(action, this.walletId, this.mailId);
    }
}
