import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectComponent } from './select';
import { HighlightPipe } from './select-pipes';
import { OffClickDirective } from './off-click';
import { MultilingualModule } from '@setl/multilingual/multilingual.module';
import { ClarityModule } from '@clr/angular';

@NgModule({
    imports: [CommonModule, MultilingualModule, ClarityModule],
    declarations: [SelectComponent, HighlightPipe, OffClickDirective],
    exports: [SelectComponent, HighlightPipe, OffClickDirective],
})
export class SelectModule {
}
