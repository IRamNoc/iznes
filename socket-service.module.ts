import {NgModule} from "@angular/core";
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {WalletNodeSocketService} from './wallet-node-socket.service';

@NgModule({
    declarations: [],
    imports: [
        ToasterModule
    ],
    exports: [],
    providers: [
        ToasterService
    ]
})

export class MemberSocketServiceModule {

}
