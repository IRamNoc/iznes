import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import { AccountAdminBaseService } from '../../../base/service';

@Injectable()
export class AccountAdminPermissionsServiceBase extends AccountAdminBaseService {
    constructor(redux: NgRedux<any>) {
        super(redux);
    }
}
