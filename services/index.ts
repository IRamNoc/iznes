import {NgModule} from '@angular/core';
import {NumberConverterService} from './number-converter/service';
import {BlockchainContractService} from './blockchain-contract/service';
import {NavHelperService} from './nav/service';
import {LogService} from './log/service';
import {FileDownloader} from './file-downloader/service';
import {HttpClientModule} from '@angular/common/http';
import {MenuSpecService} from "./menuSpec/service";

@NgModule({
    declarations: [],
    exports: [],
    imports: [HttpClientModule,
    ],
    providers: [
        NumberConverterService,
        BlockchainContractService,
        NavHelperService,
        LogService,
        FileDownloader,
        MenuSpecService,
    ]
})

export class SetlServicesModule {
}

