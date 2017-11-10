/* Core/Angular imports. */
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
/* Pipes. */
import {SetlPipesModule} from "@setl/utils";
/* Clarity module. */
import {ClarityModule} from "clarity-angular";
/* Components. */
import {OfiHomeComponent} from "./home/component";

/* Decorator. */
@NgModule({
    declarations: [
        OfiHomeComponent,
    ],
    exports: [
        OfiHomeComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        ClarityModule,
        RouterModule,
        SetlPipesModule
    ],
    providers: []
})

/* Class. */
export class OfiHomeModule {

}
