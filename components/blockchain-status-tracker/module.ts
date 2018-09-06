import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { BlockchainStatusTracker } from './component';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule,
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
