import { Observable } from 'rxjs/Observable';

export class MessageActionsConfig {
    type: string = 'formAction';
    messageBody?: string = '';
    actions: MessageAction[] = [];
    content: MessageField[] = [];
    completeText: string = 'Complete';
}

export class MessageAction {
    text: string = '';
    messageType: string = ''; // tx
    payload: any; // api payload,
    successType: string;
    failureType: string;
    styleClasses?: string = '';
}

export class MessageField {
    name: string = '';
    content: string = '';
}
