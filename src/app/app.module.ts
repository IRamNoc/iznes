import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, FormControl, NgModel} from '@angular/forms';
import {ClarityModule} from 'clarity-angular';
import {RouterModule} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HttpModule} from '@angular/http';

/* Routes. */
import { ROUTES } from "./app.routes";

/* SETL Modules. */
import { SetlLoginModule } from '@setl/core-login';

/* Components. */
import { AppComponent } from './app.component';
import { TestComComponent } from './test-com/test-com.component';
import { BasicLayoutComponent } from './layouts/basic/basic.component';
import { BlankLayoutComponent } from './layouts/blank/blank.component';

@NgModule({
    declarations: [
        AppComponent,
        TestComComponent,
        BasicLayoutComponent,
        BlankLayoutComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        ClarityModule.forRoot(),
        RouterModule.forRoot(ROUTES),
        SetlLoginModule,
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {

}
