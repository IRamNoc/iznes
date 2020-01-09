import { Injectable } from '@angular/core';
import {
    SET_SITE_MENU,
} from '@setl/core-store';
import { NgRedux } from '@angular-redux/store';
import { SagaHelper } from '@setl/utils';
import { MyUserService } from '@setl/core-req-services';

@Injectable()
export class LoginService {
    constructor(
        private ngRedux: NgRedux<any>,
        private myUserService: MyUserService,
    ) {
    }

    postLoginRequests() {
        if (this.myUserService.isReady()){
            const asyncTaskPipes = this.myUserService.getSiteMenu(this.ngRedux);
            this.ngRedux.dispatch(SagaHelper.runAsync(
                [SET_SITE_MENU],
                [],
                asyncTaskPipes, {},
            ));
            this.myUserService.loginInit();
            this.myUserService.startSessionTimeoutWatcher();
        }
    }
}
