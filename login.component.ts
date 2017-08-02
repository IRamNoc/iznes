/* Core imports. */
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

/* Notifications. */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterService } from 'angular2-toaster';

/* Login Service. */
import { LoginService } from './login.service';

/* Dectorator. */
@Component({
    selector: 'setl-login',
    templateUrl: 'login.component.html',
    styleUrls: [ 'login.component.css' ],
    providers: [ LoginService, ToasterService ]
})

/* Class. */
export class SetlLoginComponent {

    public toasterconfig:any;
    public email:string;
    public password:string;
    public prompt:string;
    public buttonDisabled:boolean = false;

    /* Constructor. */
    constructor (
        private toasterService:ToasterService,
        private loginService:LoginService
    ) {
        /* Stub */
        // this.loginService.subscribeWorkers(function (data){
        //     console.log( "|- worker-Message" );
        //     console.log( "| ", data );
        // });
    }

    /**
     * Send Login
     * Sends a login request to the service.
     */
     public sendLogin (event):boolean {
         /* Stop propagation. */
         event.preventDefault();

         /* Empty prompt. */
         this.prompt = "";

         /* Validate the we have the email and password. */
         if ( !this.email || !this.password ) {
            //  this.toasterService.pop('error', 'Enter your Details.', 'Both your email and password are required to login.');
             this.prompt = 'Email and Password are required to login.';
             return false;
         }

         /* Hide the button. */
         this.buttonDisabled = true;

         /* Send the login call. */
         this.loginService.handleLogin({
             UserName: this.email,
             Password: this.password,
         }).then((data) => {
             console.log( '|- Login Response' );
             console.log( '| code: ', data[0] );
             console.log( '| data: ', data[1] );

             /* Make button clickable again. */
             this.buttonDisabled = true;
         })

         /* Return false to event. */
         return false;
     }

}
