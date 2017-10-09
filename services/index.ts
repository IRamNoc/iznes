import {NgModule} from '@angular/core';
import {NumberConverterService} from './number-converter/service';
import {BlockchainContractService} from './blockchain-contract/service';

@NgModule({
    declarations: [],
    exports: [],
    imports: [],
    providers: [
        NumberConverterService,
        BlockchainContractService
    ]
})

export class SetlServicesModule {
}
