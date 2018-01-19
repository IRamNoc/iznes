export class MessageConnectionConfig {
    type: string = 'connection';
    messageBody?: string = '';
    actions: MessageConnection[] = [];
    content: MessageField[] = [];
    completeText: string = 'Complete';
}

export class MessageConnection {
    text: string = '';
    text_mltag: string = '';
    payload: any; // api payload,
    styleClasses?: string = '';
}

export class MessageField {
    name: string = '';
    name_mltag: string = '';
    content: string = '';
}