import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MyRequestsComponent, MyRequestsContainerComponent, NewKycRequestComponent} from "../../index";

const requestsRoute: Routes = [{
    path: '',
    component: MyRequestsContainerComponent,
    children: [
        {
            path: 'list',
            component: MyRequestsComponent,
        },
        {
            path: 'new',
            component: NewKycRequestComponent,
        },
    ],
}];

@NgModule({
    imports: [
        RouterModule.forChild(requestsRoute)
    ],
    exports: [
        RouterModule
    ]
})
export class RequestsRoutingModule {
}