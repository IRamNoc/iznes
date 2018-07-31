import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {isEmpty, find} from 'lodash';

@Component({
    selector: 'kyc-details-beneficiaries',
    templateUrl: './beneficiaries.component.html'
})
export class KycDetailsBeneficiariesComponent implements OnInit {

    @Input() beneficiaries;
    @Output() close: EventEmitter<void> = new EventEmitter();

    open = true;

    constructor(
    ) {
    }

    ngOnInit() {
    }

    modalOpenChange() {
        this.close.emit();
    }

    getName(beneficiary){
        let firstName = find(beneficiary, ['originalId', 'firstName']).value;
        let lastName = find(beneficiary, ['originalId', 'lastName']).value;

        return [firstName, lastName].join(' ');
    }

}