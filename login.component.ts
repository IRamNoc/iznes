/* Core imports. */
import {Component, OnDestroy} from '@angular/core';

/* Notifications. */
import {ToasterService} from 'angular2-toaster';

import {Router} from '@angular/router';

import {
    FormGroup,
    Validators,
    AbstractControl,
    FormControl
} from '@angular/forms';

import {SagaHelper} from '@setl/utils';

import {NgRedux} from '@angular-redux/store';

import {
    MyUserService,
    InitialisationService,
    MyWalletsService,
    ChannelService,
    AccountsService,
    PermissionGroupService
} from '@setl/core-req-services';
import {
    SET_LOGIN_DETAIL, RESET_LOGIN_DETAIL, loginRequestAC,
    SET_AUTH_LOGIN_DETAIL, RESET_AUTH_LOGIN_DETAIL,
    getAuthentication
} from '@setl/core-store';

import {MemberSocketService} from '@setl/websocket-service';
import {Unsubscribe} from 'redux';

/* Dectorator. */
@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})

/* Class. */
export class SetlLoginComponent implements OnDestroy {
    isLogin: boolean;

    loginForm: FormGroup;
    username: AbstractControl;
    password: AbstractControl;

    // Redux unsubscription
    reduxUnsubscribe: Unsubscribe;

    /* Constructor. */
    constructor(private ngRedux: NgRedux<any>,
                private myUserService: MyUserService,
                private memberSocketService: MemberSocketService,
                private myWalletsService: MyWalletsService,
                private channelService: ChannelService,
                private accountsService: AccountsService,
                private permissionGroupService: PermissionGroupService,
                private router: Router) {
        // Subscribe to app store
        this.reduxUnsubscribe = ngRedux.subscribe(() => this.updateState());
        this.updateState();

        /**
         * Form control setup
         */
        this.loginForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });

    }

    login(value) {

        if (!this.loginForm.valid) {
            return false;
        }

        // Dispatch a login request action.
        // this.ngRedux.dispatch({type: 'my-detail/LOGIN_REQUEST'});
        const loginRequestAction = loginRequestAC();
        this.ngRedux.dispatch(loginRequestAction);

        // Create a saga pipe.
        const asyncTaskPipe = this.myUserService.loginRequest({
            username: value.username,
            password: value.password
        });

        // Send a saga action.
        // Actions to dispatch, when request success:  LOGIN_SUCCESS.
        // Actions to dispatch, when request fail:  RESET_LOGIN_DETAIL.
        // saga pipe function descriptor.
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_LOGIN_DETAIL, SET_AUTH_LOGIN_DETAIL],
            [RESET_LOGIN_DETAIL, RESET_AUTH_LOGIN_DETAIL],
            asyncTaskPipe));

        return false;
    }

    updateState() {
        const newState = this.ngRedux.getState();
        const myAuthenData = getAuthentication(newState);

        // When first Login, Perform initial actions.
        if (!this.isLogin && myAuthenData.isLogin) {
            this.router.navigateByUrl('/home');

            this.isLogin = true;

            // Set token for membernode connection
            const token = myAuthenData.token;
            this.memberSocketService.token = token;

            // Request initial data from member node.
            InitialisationService.membernodeInitialisation(
                this.ngRedux,
                this.myWalletsService,
                this.memberSocketService,
                this.channelService,
                this.accountsService,
                this.myUserService,
                this.permissionGroupService
            );
        }

    }

    ngOnDestroy() {
        this.reduxUnsubscribe();
    }
}
