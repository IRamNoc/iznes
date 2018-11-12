import { Routes } from '@angular/router';
import { NewKycRequestComponent } from './request/new-request.component';
import { MyRequestsContainerComponent } from './my-requests-container.component';
import { MyRequestsComponent } from './list/my-requests.component';

export const requestsRoute: Routes = [{
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
