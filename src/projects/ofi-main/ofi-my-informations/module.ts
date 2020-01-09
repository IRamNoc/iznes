/* Core/Angular imports. */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* Pipes. */
import { SelectModule, SetlPipesModule, SetlComponentsModule, SetlDirectivesModule } from '@setl/utils';
/* Clarity module. */
import { ClarityModule } from '@clr/angular';

import { MultilingualModule } from '@setl/multilingual';

/* Components. */
import { OfiMyInformationsComponent } from './my-informations/component';

import { phoneCodeList } from '../shared/phone-codes.values';

/* Decorator. */
@NgModule({
    declarations: [
        OfiMyInformationsComponent,
    ],
    exports: [
        OfiMyInformationsComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        RouterModule,
        MultilingualModule,
        SelectModule,
        SetlPipesModule,
        SetlComponentsModule,
        SetlDirectivesModule,
    ],
    providers: [
        { provide: 'phoneCodeList', useValue: phoneCodeList },
    ],
})

/* Class. */
export class OfiMyInformationsModule {
}
