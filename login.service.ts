/* Core Imports. */
import { Injectable } from '@angular/core';

/* Setl Websocket. */
import { SocketClusterWrapper } from '@setl/socketcluster-wrapper';

@Injectable()
export class LoginService {
    /* Properties. */
    public loggedIn:boolean;
    public setlWebsocket:any;
    public workerMessageChannel:any;

    /* Constructor. */
    constructor () {
        /* Setup the websocket connection. */
        this.setlWebsocket = new SocketClusterWrapper(
            'ws',
            '10.0.1.163',
            '9788',
            'db'
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
             /* Build a request. */
             var Request = {
                 MessageType: 'DataRequest',
                 MessageHeader: '',
                 RequestID: 0,
                 //MessageBody: {RequestName: 'Login', UserName: username, Password: password, CFCountry: nz(document.cf_ipcountry, '.')}
                 // CFCountry just legacy. It still required as a parameter, but it is not used for anything. <- typical...
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

     /**
      * Subscribe Workers
      * Subscribe to the worker channel.
      * TODO delete this after testing.
      * @return {void}
      */
     public subscribeWorkers (callback):void {
         /* Check if we already have a channel made. */
         if ( ! this.workerMessageChannel ) {
             console.log('Subscribing to worker channel.');
             this.workerMessageChannel = this.setlWebsocket.webSocketConn.subscribe('worker-Message');
         }

         /* Un watch and re-watch the channel. */
         this.workerMessageChannel.unwatch();
         this.workerMessageChannel.watch(function(data){
             /* Callback. */
             callback(data);
         });
     }
}
