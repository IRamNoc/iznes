/* Core/Angular Imports. */
import { NgModule } from '@angular/core';

/* Directive. */
import {MultilingualDirective} from './multilingual.directive';
import {TranslateDirective} from './translate.directive';

/* Service. */
import {MultilingualService} from './multilingual.service';

/* Module declaration. */
@NgModule({
    declarations: [
        MultilingualDirective,
        TranslateDirective,
    ],
    imports: [],
    exports: [
        MultilingualDirective,
        TranslateDirective,
    ],
    providers: [
        MultilingualService,
    ]
})
export class MultilingualModule {  }
