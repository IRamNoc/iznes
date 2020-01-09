import {NgModule} from '@angular/core';
import {AlertsServiceMock} from './mock/alerts-service';
import {MemberSocketServiceMock} from './mock/member-socket-service';
import {ROUTES} from './mock/routes';
import {ToasterServiceMock} from './mock/toaster-service';
import {ToasterModule} from 'angular2-toaster';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';

@NgModule({
    imports: [
        ToasterModule,
        RouterModule.forRoot(ROUTES)
    ],
    exports: [],
    declarations: [],
    providers: [
        // AlertsService,
        // MemberSocketService,
        // ToasterService,
        {provide: APP_BASE_HREF, useValue: '/'}
    ],
})
export class CoreTestUtilModule {
}
