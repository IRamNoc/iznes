import {Observable} from 'rxjs/Observable';

export class MessageActionsConfig {
    type: string = 'formAction';
    messageBody?: string = '';
    actions: MessageAction[] = [];
    content: MessageField[] = [];
}

export class MessageAction {
    text: string = '';
    text_mltag: string = '';
    type: string = ''; // tx
    payload: any; // api payload,
    successType: string;
    failureType: string;
    styleClasses?: string = '';
}

export class MessageField {
    name: string = '';
    name_mltag: string = '';
    content: string = '';
}