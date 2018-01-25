// Vendors
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {
    FormGroup,
    Validators,
    AbstractControl,
    FormControl
} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';
import * as _ from 'lodash';

// Internals
import {SagaHelper} from '@setl/utils';
import {
    MyUserService,
    InitialisationService,
    MyWalletsService,
    ChannelService,
    AccountsService,
    PermissionGroupService,
    ChainService
} from '@setl/core-req-services';
import {
    SET_LOGIN_DETAIL, RESET_LOGIN_DETAIL, loginRequestAC,
    SET_AUTH_LOGIN_DETAIL, RESET_AUTH_LOGIN_DETAIL,
    SET_PRODUCTION
} from '@setl/core-store';
import {MemberSocketService} from '@setl/websocket-service';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {Subscription} from 'rxjs/Subscription';


/* Dectorator. */
@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})

/* Class. */
export class SetlLoginComponent implements OnDestroy, OnInit {
    isLogin: boolean;

    loginForm: FormGroup;
    username: AbstractControl;
    password: AbstractControl;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    @select(['user', 'authentication']) authenticationOb;

    /* Constructor. */
    constructor(private ngRedux: NgRedux<any>,
                private myUserService: MyUserService,
                private memberSocketService: MemberSocketService,
                private myWalletsService: MyWalletsService,
                private channelService: ChannelService,
                private accountsService: AccountsService,
                private permissionGroupService: PermissionGroupService,
                private router: Router,
                private alertsService: AlertsService,
                private chainService: ChainService,
                private initialisationService: InitialisationService) {

        /**
         * Form control setup
         */
        this.loginForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });


    }

    ngOnInit() {
        this.isLogin = false;


        // Reduce observable subscription
        this.subscriptionsArray.push(this.authenticationOb.subscribe(authentication => {
            this.updateState(authentication);
        }));

        window.onbeforeunload = null;

    }

    login(value) {

        if (!this.loginForm.valid) {
            return false;
        }

        // if the alert popup exists.
        if (document.getElementsByClassName('jaspero__dialog-icon').length > 0) {
            // remove the popup and return false.
            const elements = document.getElementsByClassName('error');
            if (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
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
            [SET_LOGIN_DETAIL, SET_AUTH_LOGIN_DETAIL, SET_PRODUCTION],
            [RESET_LOGIN_DETAIL, RESET_AUTH_LOGIN_DETAIL],
            asyncTaskPipe,
            {},
            () => {
            },
            // Fail to login
            (data) => {
                this.handleLoginFailMessage(data);
            }
        ));

        return false;
    }

    updateState(myAuthenData) {
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
                this.permissionGroupService,
                this.chainService,
                this.initialisationService
            );
            window.onbeforeunload = function (e) {
                const leaveMessage = 'Changes that you made may not be saved if you leave this page.';
                e.returnValue = leaveMessage;
                return leaveMessage;
            };
        }

    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    handleLoginFailMessage(data) {
        const responseStatus = _.get(data, '[1].Data[0].Status', 'other').toLowerCase();

        switch (responseStatus) {
            case 'fail':
                this.showLoginErrorMessage(
                    '<span mltag="txt_loginerror" class="text-warning">Sorry, login details incorrect, please try again.</span>'
                );
                break;
            case 'locked':
                this.showLoginErrorMessage(
                    '<span mltag="txt_accountlocked" class="text-warning">Sorry, your account has been locked. ' +
                    'Please contact Setl support.</span>'
                );
                break;
            default:
                this.showLoginErrorMessage(
                    '<span mltag="txt_loginproblem" class="text-warning">Sorry, there was a problem logging in, please try again.</span>'
                );
                break;
        }
    }

    showLoginErrorMessage(msg) {
        this.alertsService.create('error', msg);
    }
}
