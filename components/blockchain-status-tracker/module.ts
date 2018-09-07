import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { BlockchainStatusTracker } from './component';
import { SetlDirectivesModule } from '@setl/utils';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule,
        SetlDirectivesModule,
    ],
    declarations: [
        BlockchainStatusTracker,
    ],
    exports: [
        BlockchainStatusTracker,
    ],
})
export class BlockchainStatusTrackerModule {
}
