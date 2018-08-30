import { ChangeDetectorRef, Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SetlIssueAssetActionService } from './issue-asset-action.service';
import { IssueAssetActionModel } from './issue-asset-action.model';
import { WalletNodeSocketService } from '@setl/websocket-service';
import { NgRedux, select } from '@angular-redux/store';

/**
 * SETL Message Issue Asset Component
 *
 * Displays a list of assets to issue to sender
 */
@Component({
    selector: 'setl-issue-asset-action',
    templateUrl: './issue-asset-action.html',
    styleUrls: ['./issue-asset-action.scss']
})
export class SetlIssueAssetActionComponent implements OnInit {
    @Input() config: any;
    @Input() walletId: string;
    @Input() isActed: boolean;
    @Input() mailId: number;
    @Output() onActed = new EventEmitter<number>();

    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;

    instruments: any[] = [];
    instrument: any[] = [];

    constructor(
        private service: SetlIssueAssetActionService,
        private walletNodeSocket: WalletNodeSocketService,
        private redux: NgRedux<any>,
        private changeDetector: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.connectedWallet$.subscribe((connectedWalletId) => {
            const request = {
                messageType: 'request',
                messageHeader: '',
                requestID: 0, // requestID in here will be set later in sendRequest method.
                messageBody: {
                    topic: 'instruments',
                    walletid: connectedWalletId,
                }
            };
            this.walletId = connectedWalletId;

            this.walletNodeSocket.sendRequest(request, (errorCpde, message) => {
                console.log('Got WALLET INSTRUMENTS', message);
                this.instruments = message.data.map(inst => 
                    ({ id: `${inst[1]}|${inst[2]}`, text: `${inst[1]} | ${inst[2]}` }));
                if (this.instruments.length) {
                    this.instrument = [this.instruments[0]];
                }
                this.changeDetector.markForCheck();
            });
        });
    }

    onActionClick(action: IssueAssetActionModel): void {
        this.service.doAction(action, this.walletId, this.instrument, this.mailId).then(() => {
            this.changeDetector.markForCheck();
            this.onActed.emit(this.mailId);
        });
    }
}
