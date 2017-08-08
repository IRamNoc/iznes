/* Core imports. */
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

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
        BrowserModule,
        FormsModule,
        RouterModule
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
