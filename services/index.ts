import {NgModule} from '@angular/core';
import {NumberConverterService} from './number-converter/service';
import {BlockchainContractService} from './blockchain-contract/service';
import {NavHelperService} from './nav/service';
import {LogService} from './log/service';

@NgModule({
    declarations: [],
    exports: [],
    imports: [],
    providers: [
        NumberConverterService,
        BlockchainContractService,
        NavHelperService,
        LogService
    ]
})

export class SetlServicesModule {
}
