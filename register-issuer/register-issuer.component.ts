import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-register-issuer',
    templateUrl: './register-issuer.component.html',
    styleUrls: ['./register-issuer.component.css']
})
export class RegisterIssuerComponent implements OnInit {

    walletAddresses: Array<string>;

    constructor() {
        this.walletAddresses = [
            'adssds',
            'bdssds',
            'cdssds',
            'ddssds',
            'edssds',
        ];
    }

    ngOnInit() {
    }

}
