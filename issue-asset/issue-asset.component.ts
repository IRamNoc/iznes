import {Component, OnInit} from '@angular/core';

import {SagaHelper} from '@setl/utils';

import {NgRedux} from '@angular-redux/store';
import {
    getWalletAddressList
} from '@setl/core-store';

@Component({
    selector: 'app-issue-asset',
    templateUrl: './issue-asset.component.html',
    styleUrls: ['./issue-asset.component.css']
})
export class IssueAssetComponent implements OnInit {

    constructor(private ngRedux: NgRedux<any>) {
        ngRedux.subscribe(() => this.updateState());
        this.updateState();
    }

    ngOnInit() {
    }

    updateState() {
        const newState = this.ngRedux.getState();
        const currentWalletAddressList = getWalletAddressList(newState);

        console.log(currentWalletAddressList);
        console.log('ts')
    }

}
