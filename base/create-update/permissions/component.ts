import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-core-admin-permissions',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class UserTeamsPermissionsComponentBase<Type> implements OnInit, OnDestroy {

    constructor() { }

    ngOnInit() {}

    ngOnDestroy() { }
}
