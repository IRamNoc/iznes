export class MessageConnectionConfig {
    type = 'connection';
    messageBody? = '';
    actions: MessageConnection[] = [];
    content: MessageField[] = [];
    completeText = 'Connection request has been actioned';
}

export class MessageConnection {
    text = '';
    text_mltag = '';
    payload: any; // api payload,
    styleClasses? = '';
}

export class MessageField {
    name = '';
    name_mltag = '';
    content = '';
}
