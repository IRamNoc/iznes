import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

/* My informations module */
import {OfiMyInformationsModule} from '../ofi-my-informations/module';

/* Components. */
import {OfiProfileMyInformationsComponent} from './profile-my-informations/component';

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
        OfiMyInformationsModule,
    ],
    providers: [

    ]
})

/* Class. */
export class OfiProfileModule {

}
