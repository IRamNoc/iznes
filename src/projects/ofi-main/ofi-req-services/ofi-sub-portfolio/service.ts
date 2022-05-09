import { Injectable } from '@angular/core';

import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeSagaRequest } from '@setl/utils/common';

import {
    Subportfolio,
    OfiUpdateSubPortfolioData,
    OfiDeleteSubPortfolioData,
    OfiGetSubPortfolioBankingDetailsData,
    OfiDeleteSubPortfolioRequestBody,
    OfiGetSubPortfolioBankingDetailsBody,
} from './model';

@Injectable()
export class OfiSubPortfolioReqService {
    constructor(
        private memberSocketService: MemberSocketService,
    ) {
    }

    saveNewSubPortfolio(data: Subportfolio): any {
        const messageBody = {
            ...data,
            RequestName: 'iznsavenewsubportfolio',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    updateSubPortfolio(data: OfiUpdateSubPortfolioData): any {
        const messageBody = {
            ...data,
            RequestName: 'iznupdatesubportfoliodetails',
            token: this.memberSocketService.token,
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

    getSubPortfolioBankingDetails(data: OfiGetSubPortfolioBankingDetailsData) {
        const messageBody: OfiGetSubPortfolioBankingDetailsBody = {
            RequestName: 'izngetsubportfoliodetails',
            token: this.memberSocketService.token,
            walletId: data.walletId,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
