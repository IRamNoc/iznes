/* Core/Angular imports. */
import { Injectable } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
/* Membersocket and nodeSagaRequest import. */
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
/* Import actions. */

/* Import interfaces for message bodies. */
import {
    OfiAddSubPortfolioRequestBody,
    OfiDeleteSubPortfolioRequestBody,
} from './model';

interface OfiAddSubPortfolioData {
    walletId: number;
    name: string;
    iban: string;
}

interface OfiDeleteSubPortfolioData {
    walletId: number;
    address: string;
}

@Injectable()
export class OfiSubPortfolioService {

    /* Constructor. */
    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>) {
    }

    saveNewSubPortfolio(data: OfiAddSubPortfolioData): any {

        const messageBody: OfiAddSubPortfolioRequestBody = {
            RequestName: 'iznsavenewsubportfolio',
            token: this.memberSocketService.token,
            walletId: data.walletId,
            name: data.name,
            iban: data.iban,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    deleteSubPortfolio(data: OfiDeleteSubPortfolioData): any {

        const messageBody: OfiDeleteSubPortfolioRequestBody = {
            RequestName: 'izndeletesubportfolio',
            token: this.memberSocketService.token,
            walletId: data.walletId,
            address: data.address,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
