import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import {MemberSocketService, WalletNodeSocketService} from '@setl/websocket-service';
import {MyUserService} from "@setl/core-req-services";

@Component({
    selector: 'app-logout',
    template: '',
})
export class SetlLogoutComponent implements OnInit {

    constructor(
        private ngRedux: NgRedux<any>,
        private router: Router,
        private walletSocket: WalletNodeSocketService,
        private memberSocketService: MemberSocketService,
        private myUserService: MyUserService,
    ) {
    }

    ngOnInit() {
        this.myUserService.logout();
    }
}
