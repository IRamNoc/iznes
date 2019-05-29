import { Inject } from '@angular/core';
import { BaseDataService, MyUserService, MyWalletsService } from '../..';
import { select } from '@angular-redux/store';
import { map } from 'rxjs/operators';

@Inject({
    providedIn: 'root',
})
export class MyWalletDataService extends BaseDataService<MyWalletsService> {
    @select(['wallet', 'allWalletAddresses', 'addresses']) private readonly allAddress$;

    constructor(protected dataService: MyWalletsService, protected myUserService: MyUserService) {
        super(dataService, myUserService);
    }

    onInit() {
        super.setupData(
            'allWalletAddresses',
            'setWalletAddresses',
            this.allAddress$,
            this.needRequest(),
        );
    }

    needRequest() {
        return this.allAddress$.pipe(
            map(d => d === undefined),
        );
    }

    getWalletAddresses() {
        return super.getData<any>('allWalletAddresses');
    }

}
