import {Component, OnInit, Pipe} from '@angular/core';

import {SagaHelper, Common} from '@setl/utils';
import {NgRedux} from '@angular-redux/store';

import {
    SET_MESSAGE_LIST, getMyMessagesList
} from '@setl/core-store';


import {MyMessagesService} from '@setl/core-req-services';

@Component({
    selector: 'setl-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class SetlMessagesComponent implements OnInit {

    public messages;
    public messages2;
    public categories;

    public iconTrash = 'trash'; // this.iconTrash


    requestMessages() {
        // Create a saga pipe.
        const asyncTaskPipe = this.myMessageService.requestOwnMessages(
            0,
            0,
            2,
            0,
            0,
            7,
            0,
            0,
            0,
            0,
            0,
            ''
        );

        // Send a saga action.
        // Actions to dispatch, when request success:  LOGIN_SUCCESS.
        // Actions to dispatch, when request fail:  RESET_LOGIN_DETAIL.
        // saga pipe function descriptor.
        // Saga pipe function arguments.
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_MESSAGE_LIST],
            [],
            asyncTaskPipe, {}));

        return false;
    }

    constructor(private ngRedux: NgRedux<any>,
                private myMessageService: MyMessagesService) {

        ngRedux.subscribe(() => this.updateState());
        this.updateState();

        this.requestMessages();
        this.categories = [
            {
                name: 'All Messages',
                desc: 'View your global inbox',
                icon: 'inbox',
                active: true
            },
            {
                name: 'Action Messages',
                desc: 'Messages that require actions',
                icon: 'balance',
                active: false
            },
            {
                name: 'Workflow Messages',
                desc: 'Messages with multiple actions',
                icon: 'organization',
                active: false
            },
            {
                name: 'Sent Messages',
                desc: 'Messages sent by your account',
                icon: 'pop-out',
                active: false
            },
            {
                name: 'Deleted Messages',
                desc: 'View messages that you deleted',
                icon: 'trash',
                active: false
            },
        ];

        this.messages2 = [
            {
                sender: 'SETL (Ipswich) Limited',
                subject: 'Thanks Ollie for joining.',
                date: 'Aug 17 2017',
                active: true,
                action: false,
                actionTaken: false,
                unread: false,
                workflow: false,
                publicKey: 'OdKzRoOSd8VqtV7KqT9nLv8nAtI4kyagxjlznCEMzTY=',
                imgSender: 'http://localhost:4200/favicon.ico',
                content: 'Leverage agile frameworks to provide a robust synopsis for high level overviews. ' +
                'Iterative approaches to corporate strategy foster kett sucks though for real disruptive...'
            },
            {
                sender: 'Hyundai (Hong Kong) Limited',
                subject: 'Request to commit contract C01235',
                date: 'Aug 16 2017',
                active: false,
                action: true,
                actionTaken: false,
                unread: true,
                workflow: false,
                publicKey: 'OdKzRoOSd8VqtV7KqT9nLv8nAtI4kyagxjlznCEMzTY=',
                imgSender: 'https://s.gravatar.com/avatar/9650ef3390c7015ad9c9fcabc1a11294?s=80&d=identicon',
                content: 'Organically grow the holistic world view of disruptive innovation via workplace diversity ' +
                'and empowerment.'
            },
            {
                sender: 'Luke Brown',
                subject: 'Bilateral Transfer T00017 - Offer Accepted',
                date: 'Aug 16 2017',
                active: false,
                action: true,
                actionTaken: true,
                unread: true,
                workflow: true,
                publicKey: 'OdKzRoOSd8VqtV7KqT9nLv8nAtI4kyagxjlznCEMzTY=',
                imgSender: 'https://s.gravatar.com/avatar/bb5547972001fe3752726c8a51c4b8b0?s=80',
                content: 'Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day,' +
                ' going forward, a new normal that has evolved from generation...'
            },
            {
                sender: 'Holder A (mTB21s/cqW...)',
                subject: 'Bilateral Transfer T00017 - Offer Made',
                date: 'Aug 15 2017',
                active: false,
                action: true,
                actionTaken: false,
                unread: false,
                workflow: false,
                publicKey: 'OdKzRoOSd8VqtV7KqT9nLv8nAtI4kyagxjlznCEMzTY=',
                imgSender: 'https://s.gravatar.com/avatar/96401f3690c7015ad9c9fcabc1a11294?s=80&d=identicon',
                content: ' Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. ' +
                'Override the digital divide with additional clickthroughs from DevOps...'
            },
            {
                sender: 'Nick Pennington',
                subject: 'Request to commit contract C01234',
                date: 'Aug 14 2017',
                active: false,
                action: false,
                actionTaken: false,
                unread: false,
                workflow: false,
                publicKey: 'OdKzRoOSd8VqtV7KqT9nLv8nAtI4kyagxjlznCEMzTY=',
                imgSender: 'https://s.gravatar.com/avatar/91401f3690c7015ad9c9fcabc1a11294?s=80&d=identicon',
                content: 'generation X is on the runway heading towards a streamlined cloud solution. User generated ' +
                'content in real-time will have multiple touchpoints for offshoring...'
            }
        ];
    }

    ngOnInit() {
    }

    updateState() {
        const newState = this.ngRedux.getState();
        this.messages = getMyMessagesList(newState);

        console.log(this.messages);
    }

}
