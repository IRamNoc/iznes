/* Core imports. */
import { NgModule } from "@angular/core";

/* Login view. */
import { SetlLoginComponent } from './login.component';

/* Notifications. */
import { ToasterModule, ToasterService } from 'angular2-toaster';

@NgModule({
    declarations: [
        SetlLoginComponent,
    ],
    imports: [
        ToasterModule,
    ],
    exports: [
        SetlLoginComponent,
    ],
    providers: [
        ToasterService,
    ]
})

export class SetlLoginModule {

}
