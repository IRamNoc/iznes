import {Injectable} from '@angular/core';
import {WalletNodeSocketService} from '@setl/websocket-service';

interface RegisterIssuer {

}

@Injectable()
export class WalletnodeTxService {

    constructor(private walletNodeSocketService: WalletNodeSocketService) {
    }

    registerIssuer(requestData: any) {

    }
}
