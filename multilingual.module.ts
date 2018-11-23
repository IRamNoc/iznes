/* Core/Angular Imports. */
import { NgModule } from '@angular/core';

/* Directive. */
import { MultilingualDirective } from './multilingual.directive';

/* Service. */
import { MultilingualService } from './multilingual.service';

/* Module declaration. */
@NgModule({
    declarations: [
        MultilingualDirective,
    ],
    imports: [],
    exports: [
        MultilingualDirective,
    ],
    providers: [
        MultilingualService,
    ],
})
export class MultilingualModule {  }
