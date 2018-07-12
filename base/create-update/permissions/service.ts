import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import { AccountAdminBaseService } from '../../../base/service';

@Injectable()
export class UserTeamsPermissionsServiceBase extends AccountAdminBaseService {
    constructor(redux: NgRedux<any>) {
        super(redux);
    }
}
