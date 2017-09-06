import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
    selector: 'app-manage-chain-membership',
    templateUrl: 'component.html'
})

export class ManageChainMembershipComponent implements OnInit {
    tabsControl: Array<object>;

    constructor() {
        /* Default tabs. */
        this.tabsControl = [
            {
                title: '<i class="fa fa-search"></i> Search',
                userId: -1,
                active: true
            },
            {
                title: '<i class="fa fa-plus"></i> Add New Member',
                userId: -1,
                formControl: new FormGroup(
                    {
                        username: new FormControl(''),
                        email: new FormControl(''),
                        accountType: new FormControl([]),
                        userType: new FormControl([]),
                        password: new FormControl('')
                    }
                ),
                active: false
            }
        ];
    }

    ngOnInit() {
    }
}
