import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import { ClarityModule } from 'clarity-angular';
import { SetlMessagesComponent } from './messages.component';
import { SetlMessageBodyComponent } from './message-components/message-body/message-body.component';
import { SetlMessageAttachmentComponent } from './message-components/message-attachment/message-attachment.component';
import { SetlMessageFormActionComponent } from './message-components/message-form-action/message-form-action.component';
import { SetlMessageConnectionComponent } from './message-components/message-connection/message-connection.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from '@setl/utils/components/ng2-select/select.module';
import { QuillEditorModule } from 'ngx-quill-editor';
import { SetlPipesModule } from '@setl/utils/pipes';
import { FileViewerModule } from '@setl/core-fileviewer/fileviewer.module';
import { FileViewerComponent } from '../../core-fileviewer/fileviewer.component';
import { MyMessagesService } from '@setl/core-req-services/my-messages/my-messages.service';
import { MemberSocketService } from '@setl/websocket-service/member-socket.service';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { MessagesService } from './messages.service';
import { MessageAction, MessageActionsConfig } from './message-components/message-form-action/message-form-action.model';
import { MockMailHelper } from './mockMailHelper';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { APP_BASE_HREF } from '@angular/common';
import { APP_CONFIG } from '@setl/utils';

const routes = [
    {
        path: 'messages/:category',
        component: SetlMessagesComponent,
    },
    {
        path: 'messages',
        redirectTo: '/messages/inbox'
    },
];

describe('SetlMessagesComponent', () => {
  let component: SetlMessagesComponent;
  let fixture: ComponentFixture<SetlMessagesComponent>;
  let encryptedMessage: {};
  const exampleMessage = {
    mailId:  1,
    senderId: 1,
    senderPub: '',
    senderImg: '',
    senderWalletName: 'Sender Wallet Name',
    recipientId: 2,
    recipientPub: '',
    recipientImg: '',
    recipientWalletName: 'Recipient Wallet Name',
    subject: 'Subject of the mail',
    content: 'Encrypted Message',
    action: '',
    date: '2017-12-07 09:41:00',
    isRead: false,
    isDecrypted: false
  };
  const messageList = [
      exampleMessage
  ];
  let mockMailHelper: MockMailHelper;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [
            SetlMessagesComponent,
            SetlMessageBodyComponent,
            SetlMessageAttachmentComponent,
            SetlMessageFormActionComponent,
            SetlMessageConnectionComponent
        ],
        imports: [
            NgReduxTestingModule,
            ClarityModule,
            FormsModule,
            ReactiveFormsModule,
            SelectModule,
            QuillEditorModule,
            NgxPaginationModule,
            SetlPipesModule,
            FileViewerModule,
            RouterModule.forRoot(routes)
        ],
        providers: [
            MyMessagesService,
            MemberSocketService,
            AlertsService,
            { provide: ActivatedRoute, useValue: { params: Observable.of({category: 'inbox'}) } },
            { provide: APP_BASE_HREF, useValue : '/' },
            {
                provide: APP_CONFIG,
                useValue: {
                    messagesMenu: [
                        {
                            name: 'All Messages',
                            desc: 'View your global inbox',
                            icon: 'inbox',
                            type: 'inbox',
                            active: true
                        },
                        {
                            name: 'Action Messages',
                            desc: 'Messages that require actions',
                            icon: 'balance',
                            type: 'action',
                            active: false
                        },
                        {
                            name: 'Sent Messages',
                            desc: 'Messages sent by your account',
                            icon: 'pop-out',
                            type: 'sent',
                            active: false
                        },
                        {
                            name: 'Deleted Messages',
                            desc: 'View messages that you deleted',
                            icon: 'trash',
                            type: 'deleted',
                            active: false
                        },
                    ]
                }
            }
        ]
    }).compileComponents();
    MockNgRedux.reset();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetlMessagesComponent);
    component = fixture.componentInstance;
    component._appConfig = {messagesMenu: [
        {
            name: 'All Messages',
            desc: 'View your global inbox',
            icon: 'inbox',
            type: 'inbox',
            active: true
        },
        {
            name: 'Action Messages',
            desc: 'Messages that require actions',
            icon: 'balance',
            type: 'action',
            active: false
        },
        {
            name: 'Sent Messages',
            desc: 'Messages sent by your account',
            icon: 'pop-out',
            type: 'sent',
            active: false
        },
        {
            name: 'Deleted Messages',
            desc: 'View messages that you deleted',
            icon: 'trash',
            type: 'deleted',
            active: false
        },
    ]};
    mockMailHelper = new MockMailHelper();
    encryptedMessage = exampleMessage;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to decrypt message contents', () => {
      const index = 0;
      component.messages = messageList;
      component.showMessage(index).then(() => {
          expect(component.messages[index].content).toBe('Decrypted Message');
      });
  });

  it('should be able to set the message list', () => {
      component.mailCounts = {
          inbox: 1
      };
      component.walletDirectoryList = {
          1: {
              walletName: 'Sender Wallet'
          },
          2: {
              walletName: 'Receiver Wallet'
          }
      };
      component.currentCategory = 'inbox';
      component.categories[component.currentCategory] = {
          type: 'inbox',
          name: 'Inbox'
      };
      component.currentMessage = messageList[0];
      component.messagesList(messageList);
  });

  it('should call requestMailboxByCategory on Page Change', () => {
      spyOn(component, 'requestMailboxByCategory');
      component.currentCategory = 'inbox';
      component.categories[component.currentCategory] = {
          type: 'inbox',
          name: 'Inbox'
      };
      component.onPageChange(1);
      expect(component.requestMailboxByCategory).toHaveBeenCalled();
  });

    it('should call requestMailboxByCategory on refreshMailbox', () => {
        spyOn(component, 'requestMailboxByCategory');
        component.currentCategory = 'inbox';
        component.categories[component.currentCategory] = {
            type: 'inbox',
            name: 'Inbox'
        };
        component.refreshMailbox(0);
        expect(component.requestMailboxByCategory).toHaveBeenCalled();
    });


    it('should call mailHelper deleteMessage and refreshMailBox when deleteMessage is called', () => {
        spyOn(component.mailHelper, 'deleteMessage');
        spyOn(component, 'refreshMailbox');
        component.deleteMessage();
        expect(component.mailHelper.deleteMessage).toHaveBeenCalled();
        expect(component.refreshMailbox).toHaveBeenCalled();
    });

    it('should be able to reset messages', () => {
        component.resetMessages();
        expect(component.messages).toEqual([]);
        expect(component.currentCategory).toBe(0);
        expect(component.currentPage).toBe(0);
        expect(component.currentMessage).toEqual({id: 0});
    });
});
