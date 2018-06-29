import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { WalletNodeSocketService } from '@setl/websocket-service';

@Component({
    selector: 'app-logout',
    template: '',
})
export class SetlLogoutComponent implements OnInit {

    constructor(
        private ngRedux: NgRedux<any>,
        private router: Router,
        private walletSocket: WalletNodeSocketService,
    ) {
    }

    ngOnInit() {
        this.ngRedux.dispatch({ type: 'USER_LOGOUT' });
        this.router.navigate(['login']);
        this.walletSocket.clearConnection();
    }
}
