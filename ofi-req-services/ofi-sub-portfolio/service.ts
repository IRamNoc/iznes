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
    OfiUpdateSubPortfolioRequestBody,
    OfiGetSubPortfolioBankingDetailsBody,
} from './model';

interface OfiAddSubPortfolioData {
    walletId: number;
    label: string;
    establishmentName: string;
    addressLine1: string;
    addressLine2: string;
    zipCode: string;
    city: string;
    country: string;
    iban: string;
    bic: string;
}

interface OfiUpdateSubPortfolioData {
    walletId: number;
    option: string;
    label: string;
    establishmentName: string;
    addressLine1: string;
    addressLine2: string;
    zipCode: string;
    city: string;
    country: string;
    iban: string;
    bic: string;
}

interface OfiDeleteSubPortfolioData {
    walletId: number;
    address: string;
}

interface OfiGetSubPortfolioBankingDetailsData {
    walletId: number;
}

@Injectable()
export class OfiSubPortfolioReqService {
    /* Constructor. */
    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>,
    ) {
    }

    saveNewSubPortfolio(data: OfiAddSubPortfolioData): any {
        const messageBody: OfiAddSubPortfolioRequestBody = {
            RequestName: 'iznsavenewsubportfolio',
            token: this.memberSocketService.token,
            walletId: data.walletId,
            label: data.label,
            establishmentName: data.establishmentName,
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2,
            zipCode: data.zipCode,
            city: data.city,
            country: data.country,
            iban: data.iban,
            bic: data.bic,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    updateSubPortfolio(data: OfiUpdateSubPortfolioData): any {
        const messageBody: OfiUpdateSubPortfolioRequestBody = {
            RequestName: 'iznupdatesubportfoliodetails',
            token: this.memberSocketService.token,
            walletId: data.walletId,
            option: data.option,
            label: data.label,
            establishmentName: data.establishmentName,
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2,
            zipCode: data.zipCode,
            city: data.city,
            country: data.country,
            iban: data.iban,
            bic: data.bic,
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
