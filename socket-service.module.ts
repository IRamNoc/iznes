import {NgModule} from "@angular/core";
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {SocketClusterWrapper} from '@setl/socketcluster-wrapper';
import {MemberSocketService} from './member-socket.service';
import {WalletNodeSocketService} from './wallet-node-socket.service';

@NgModule({
    declarations: [],
    imports: [
        ToasterModule,
        SocketClusterWrapper
    ],
    exports: [
        MemberSocketService,
        WalletNodeSocketService
    ],
    providers: [
        ToasterService
    ]
})

export class MemberSocketServiceModule {

}
