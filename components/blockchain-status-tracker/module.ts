import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockchainStatusTracker } from './component';

@NgModule({
    imports: [
        CommonModule,
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
