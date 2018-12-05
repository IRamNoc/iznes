import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { ConnectionStatusAlerts } from './component';
import { SetlPipesModule } from '@setl/utils';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule,
        SetlPipesModule,

    ],
    declarations: [
        ConnectionStatusAlerts,
    ],
    exports: [
        ConnectionStatusAlerts,
    ],
})
export class ConnectionStatusAlertsModule {
}
