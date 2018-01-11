// Vendors
import {Injectable} from '@angular/core';

// Internal
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {RequestMyChainAccessMessageBody, ChainsRequestMessageBody, ChainRequestBody, DeleteChainRequestBody} from './service.model';
import {setRequestedChain, clearRequestedChain, SET_CHAINS_LIST} from '@setl/core-store/chain/chain-list/actions';

interface ChainData {
    chainId?: any;
    chainName?: any;
}

@Injectable()
export class ChainService {
    constructor(private memberSocketService: MemberSocketService) {
    }


    requestMyChainAccess(): any {
        const messageBody: RequestMyChainAccessMessageBody = {
            RequestName: 'gmyca',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    static setRequested(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(clearRequestedChain());
        } else {
            ngRedux.dispatch(setRequestedChain());
        }
    }

    static defaultRequestChainsList(chainService: ChainService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedChain());

        // Request the list.
        const asyncTaskPipe = chainService.requestChainsList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_CHAINS_LIST],  // SET est en fait un GETLIST
            [],
            asyncTaskPipe,
            {},
        ));
    }

    requestChainsList(): any {
        const messageBody: ChainsRequestMessageBody = {
            RequestName: 'gmcl',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveChain(cData: ChainData, ngRedux: NgRedux<any>): any {

        const messageBody: ChainRequestBody = {
            RequestName: 'nc',
            token: this.memberSocketService.token,
            chainId: cData.chainId,
            chainName: cData.chainName,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    updateChain(cData: ChainData, ngRedux: NgRedux<any>): any {
        const messageBody: ChainRequestBody = {
            RequestName: 'udc',
            token: this.memberSocketService.token,
            chainId: cData.chainId,
            chainName: cData.chainName,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    deleteChain(cData: ChainData, ngRedux: NgRedux<any>): any {

        const messageBody: DeleteChainRequestBody = {
            RequestName: 'dc',
            token: this.memberSocketService.token,
            chainId: cData.chainId
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
