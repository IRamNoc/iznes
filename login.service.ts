/* Core Imports. */
import { Injectable } from '@angular/core';

/* Setl Websocket. */
import {SetlWebSocket, SetlCallbackRegister} from 'setl-websocket';

@Injectable()
export class LoginService {
    /* Properties. */
    public loggedIn:boolean;
    public setlCallBackRegister:any;
    public setlWebsocket:any;

    /* Constructor. */
    constructor () {
        /* Setup the websocket connection. */
        this.setlCallBackRegister = new SetlCallbackRegister();
        this.setlWebsocket = new SetlWebSocket(
            'ws:',
            '10.0.1.163',
            '9788',
            false,
            this.setlCallBackRegister
        );

        /* Init the connection, */
        this.setlWebsocket.openWebSocket();
    }

    /**
     *  Handle Login
     *  Sends a login request.
     *  @param {logindata} :object
     *  @return {loginpromise} :object
     */
     public handleLogin ( logindata ) {
         /* Return a promise to handle the login. */
         return new Promise((resolve, reject) => {
             /* Message ID reference. */
             let messageID = this.setlCallBackRegister.uniqueIDValue;

             /* Add message handler. */
             this.setlCallBackRegister.addHandler(messageID, (id, event, userData) => {
                 console.log(event);
             }, {});

             /* Build a request. */
             var Request = {
                 MessageType: 'DataRequest',
                 MessageHeader: '',
                 RequestID: messageID,
                 //MessageBody: {RequestName: 'Login', UserName: username, Password: password, CFCountry: nz(document.cf_ipcountry, '.')}
                 // CFCountry just legacy. It still required as a parameter, but it is not used for anything.
                 MessageBody: {
                     RequestName: 'Login',
                     UserName: logindata.UserName,
                     Password: logindata.Password,
                     CFCountry: '.'
                 }
             };

             /* Send the request. */
             this.setlWebsocket.sendRequest([Request, (err, data) => {
                 resolve([err, data]);
             }]);
         })
     }
}
