import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, FormControl, NgModel} from '@angular/forms';
import {ClarityModule} from 'clarity-angular';
import {RouterModule} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HttpModule} from '@angular/http';


import {AppComponent} from './app.component';
import {ROUTES} from "./app.routes";
// import {SetlLoginModule, SetlLoginComponent} from '@setl/core-login';
// import { TestComComponent } from './test-com/test-com.component';

@NgModule({
    declarations: [
        AppComponent
        // TestComComponent

    ],
    imports: [
        BrowserModule,
        HttpModule,
        ClarityModule.forRoot(),
        // SetlLoginModule,
        // RouterModule.forRoot(ROUTES),
        FormsModule,
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
