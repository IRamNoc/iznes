import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SetlComponentsModule, SetlDirectivesModule, SetlPipesModule } from '@setl/utils/index';

/* My informations module */
import { OfiMyInformationsModule } from '../ofi-my-informations/module';

/* Components. */
import { OfiProfileMyInformationsComponent } from './profile-my-informations/component';

/* Decorator. */
@NgModule({
    declarations: [
        OfiProfileMyInformationsComponent,
    ],
    exports: [
        OfiProfileMyInformationsComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        OfiMyInformationsModule,
        ClarityModule,
        FormsModule,
        ReactiveFormsModule,
        SetlComponentsModule,
        SetlDirectivesModule,
        SetlPipesModule,
    ],
    providers: [

    ],
})

/* Class. */
export class OfiProfileModule {

}
