import { Inject } from '@angular/core';
import { BaseDataService, InitialisationService, MyUserService, WalletNodeRequestService } from '../..';
import { select } from '@angular-redux/store';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Inject({
    providedIn: 'root',
})
export class ChainDataService extends BaseDataService<WalletNodeRequestService> {
    @select(['asset', 'allInstruments', 'requested']) private readonly requestedAllInstrument$;
    @select(['asset', 'allInstruments', 'instrumentList']) private readonly allInstruments$;

    constructor(protected dataService: WalletNodeRequestService, protected myUserService: MyUserService) {
        super(dataService, myUserService);
    }

    onInit() {
        super.setupData(
            'allinstruments',
            'getAllInstruments',
            this.allInstruments$,
            this.requestedAllInstrument$,
        );
    }

    getAllInstruments(): Observable<AllInstruments> {
        return super.getData<any>('allinstruments');
    }

    getAllInstrumentsNgSelectList(): Observable<NgSelectListItem[]> {
        return this.getAllInstruments().pipe(
            map((d) => {
                return Object.keys(d)
                    .filter(k => k !== 'SYS|STAKE')
                    .map((k) => {
                        return {
                            id: k,
                            text: k,
                        };
                    });
            }),
        );
    }
}

type AllInstruments = {
    [instrument: string]: {
        issuer: string;
        instrument: string;
        issuerAddress: string;
        metaData: any;
    };
};

export type NgSelectListItem = {
    id: string;
    text: string;
};
