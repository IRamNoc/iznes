import {NgModule} from '@angular/core';
import {NumberConverterService} from './number-converter/service';
import {BlockchainContractService} from './blockchain-contract/service';
import {NavHelperService} from './nav/service';
import {LogService} from './log/service';
import {FileDownloader} from './file-downloader/service';
import {HttpClientModule} from '@angular/common/http';
import {MenuSpecService} from './menuSpec/service';
import { PermissionsService } from './permissions';
import { PermissionsRequestService } from '@setl/core-req-services/permissions/permissions-request.service';

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
        PermissionsService,
        PermissionsRequestService,
    ],
})

export class SetlServicesModule {
}
