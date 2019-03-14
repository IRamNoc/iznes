import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MandateInvestorGridComponent } from './mandate-investor-grid.component';
import { OfiInviteMandateInvestorsComponent } from './invite/component';
import { ClarityModule } from '@clr/angular';
import { SetlPipesModule } from '@setl/utils';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from '@setl/utils/components/ng2-select/select.module';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule,
        SetlPipesModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
    ],
    declarations: [
        MandateInvestorGridComponent,
        OfiInviteMandateInvestorsComponent,
    ],
    exports: [MandateInvestorGridComponent],
    providers: [],
})
export class OfiMandateInvestorModule { }
