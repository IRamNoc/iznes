import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { SagaHelper, Common } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import {
    SicavRequestMessageBody,
    SaveSicavRequestBody,
    UpdateSicavRequestBody,
    DeleteSicavRequestBody,
} from './sicav.service.model';
import { setRequestedSicav, clearRequestedSicav, SET_SICAV_LIST } from '../../../ofi-store/ofi-product/sicav/sicav-list/actions';

interface InsertSicavData {
    companyID: any;
    sicavName: any;
    country: any;
    addrPrefix: any;
    postalAddressLine1: any;
    postalAddressLine2: any;
    city: any;
    stateArea: any;
    postalcode: any;
    taxResidence: any;
    registrationNum: any;
    supervisoryAuthority: any;
    numSIRETorSIREN: any;
    creationDate: any;
    shareCapital: any;
    commercialContact: any;
    operationalContact: any;
    directorContact: any;
    lei: any;
    bic: any;
    giinCode: any;
    logoName: any;
    logoURL: any;
}

interface UpdateSicavData {
    sicavID: any;
    sicavName: any;
    country: any;
    addrPrefix: any;
    postalAddressLine1: any;
    postalAddressLine2: any;
    city: any;
    stateArea: any;
    postalcode: any;
    taxResidence: any;
    registrationNum: any;
    supervisoryAuthority: any;
    numSIRETorSIREN: any;
    creationDate: any;
    shareCapital: any;
    commercialContact: any;
    operationalContact: any;
    directorContact: any;
    lei: any;
    bic: any;
    giinCode: any;
    logoName: any;
    logoURL: any;
}

interface DeleteSicavData {
    sicavID: any;
}

@Injectable()
export class OfiSicavService {

    @select(['user', 'myDetail', 'accountId']) getMyAccountId;
    accountId = 0;

    constructor(private memberSocketService: MemberSocketService) {
        this.getMyAccountId.subscribe(getMyAccountId => this.myAccountId(getMyAccountId));
    }

    myAccountId(accountId) {
        this.accountId  = accountId;
    }

    static setRequested(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(clearRequestedSicav());
        } else {
            ngRedux.dispatch(setRequestedSicav());
        }
    }

    static defaultRequestSicavList(ofiSicavService: OfiSicavService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedSicav());

        // Request the list.
        const asyncTaskPipe = ofiSicavService.requestSicavList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_SICAV_LIST],  // SET est en fait un GETLIST
            [],
            asyncTaskPipe,
            {},
        ));
    }

    requestSicavList(): any {
        const messageBody: SicavRequestMessageBody = {
            RequestName: 'getSicavList',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    deleteSicav(sicavData: DeleteSicavData, ngRedux: NgRedux<any>): any {
        const messageBody: DeleteSicavRequestBody = {
            RequestName: 'deletesicav',
            token: this.memberSocketService.token,
            sicavID: sicavData.sicavID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveSicav(sicavData: InsertSicavData, ngRedux: NgRedux<any>): any {
        const messageBody: SaveSicavRequestBody = {
            RequestName: 'newSicav',
            token: this.memberSocketService.token,
            companyID: sicavData.companyID,
            sicavName: sicavData.sicavName,
            country: sicavData.country,
            addrPrefix: sicavData.addrPrefix,
            postalAddressLine1: sicavData.postalAddressLine1,
            postalAddressLine2: sicavData.postalAddressLine2,
            city: sicavData.city,
            stateArea: sicavData.stateArea,
            postalcode: sicavData.postalcode,
            taxResidence: sicavData.taxResidence,
            registrationNum: sicavData.registrationNum,
            supervisoryAuthority: sicavData.supervisoryAuthority,
            numSIRETorSIREN: sicavData.numSIRETorSIREN,
            creationDate: sicavData.creationDate,
            shareCapital: sicavData.shareCapital,
            commercialContact: sicavData.commercialContact,
            operationalContact: sicavData.operationalContact,
            directorContact: sicavData.directorContact,
            lei: sicavData.lei,
            bic: sicavData.bic,
            giinCode: sicavData.giinCode,
            logoName: sicavData.logoName,
            logoURL: sicavData.logoURL,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    updateSicav(sicavData: UpdateSicavData, ngRedux: NgRedux<any>): any {
        const messageBody: UpdateSicavRequestBody = { // where is the companyID ?
            RequestName: 'updateSicav',
            token: this.memberSocketService.token,
            sicavID: sicavData.sicavID,
            sicavName: sicavData.sicavName,
            country: sicavData.country,
            addressPrefix: sicavData.addrPrefix,
            postalAddressLine1: sicavData.postalAddressLine1,
            postalAddressLine2: sicavData.postalAddressLine2,
            city: sicavData.city,
            stateArea: sicavData.stateArea,
            postalCode: sicavData.postalcode,
            taxResidence: sicavData.taxResidence,
            registrationNum: sicavData.registrationNum,
            supervisoryAuthority: sicavData.supervisoryAuthority,
            numSIRETorSIREN: sicavData.numSIRETorSIREN,
            creationDate: sicavData.creationDate,
            shareCapital: sicavData.shareCapital,
            commercialContact: sicavData.commercialContact,
            operationalContact: sicavData.operationalContact,
            directorContact: sicavData.directorContact,
            lei: sicavData.lei,
            bic: sicavData.bic,
            giinCode: sicavData.giinCode,
            logoName: sicavData.logoName,
            logoURL: sicavData.logoURL,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
