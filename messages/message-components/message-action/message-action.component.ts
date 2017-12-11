import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';
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

    constructor() {}

    ngOnInit() {
        this.config = new MessageActionsConfig();

        this.config.actions.push({
            text: "Submit",
            styleClasses: "btn-primary",
            callback: () => {
                return new Observable();
            }
        });
    }

    ngOnDestroy() {}

    onActionClick(action: MessageAction): void {
        action.callback().subscribe(() => {
            if(action.onSuccessFn) action.onSuccessFn();
        }, (e: any) => {
            if(action.onErrorFn) action.onErrorFn();
        });
    }

}

export class MessageActionsConfig {
    type: string = '';
    actions: MessageAction[] = [];
    content: MessageField[] = [];
}

export class MessageAction {
    text: string = '';
    styleClasses?: string = '';
    callback: () => Observable<any>;
    onSuccessFn?: () => void;
    onErrorFn?: () => void;
}

export class MessageField {
    name: string;
    content: string;
}
