/* Core imports. */
import {Component} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';

/* Notifications. */
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToasterService} from 'angular2-toaster';

import {
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl,
    FormControl
} from '@angular/forms';

/* Login Service. */
import {SagaHelper} from '@setl/utils';

import {NgRedux} from '@angular-redux/store';
import {select} from '@angular-redux/store';


import {Observable} from 'rxjs/Observable';
import {MyUserService} from '@setl/core-req-services';
import {LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL} from '@setl/core-store';


function skuValidator(control: FormControl): { [s: string]: boolean } {
    if (!control.value.match(/^123/)) {
        return {invalidSku: true};
    }
}

/* Dectorator. */
@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css'],
    providers: [ToasterService]
})

/* Class. */
export class SetlLoginComponent {

    public toasterconfig: any;
    public prompt: string;
    public buttonDisabled: boolean = false;

    loginForm: FormGroup;
    username: AbstractControl;
    password: AbstractControl;

    // @select(state =>
    //     state.login.count
    // )
    // counterSelectedWithFunction;

    /* Constructor. */
    constructor(private toasterService: ToasterService,
                private ngRedux: NgRedux<any>,
                private myUserService: MyUserService,
                fb: FormBuilder) {

        this.loginForm = fb.group({
            'username': ['', Validators.required],
            'password': ['', Validators.required]
        });

        this.username = this.loginForm.controls['username'];
        this.password = this.loginForm.controls['password'];
    }

    login(value) {

        if (!this.loginForm.valid) {
            return false;
        }

        this.ngRedux.dispatch({type: 'my-detail/LOGIN_REQUEST'});

        const asyncTaskPipe = this.myUserService.loginRequest({
            username: value.username,
            password: value.password
        });

        this.ngRedux.dispatch(SagaHelper.runAsync([LOGIN_SUCCESS], [LOGIN_FAIL], asyncTaskPipe, {}));

        return false;
    }
}
