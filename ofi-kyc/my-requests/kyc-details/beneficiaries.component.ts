import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'kyc-details-beneficiaries',
    templateUrl: './beneficiaries.component.html',
})
export class KycDetailsBeneficiariesComponent implements OnInit {
    @Input() beneficiaries;
    @Output() close: EventEmitter<void> = new EventEmitter();

    open = true;

    constructor() {
    }

    ngOnInit() {
    }

    modalOpenChange() {
        this.close.emit();
    }

    getName(beneficiary) {
        let finalName;
        const firstName = _.chain(beneficiary).find(['originalId', 'firstName']).get('value').value();
        const lastName = _.chain(beneficiary).find(['originalId', 'lastName']).get('value').value();

        if (!firstName && !lastName) {
            finalName = _.chain(beneficiary).find(['originalId', 'legalName']).get('value').value();
        } else {
            finalName = [firstName, lastName].join(' ');
        }

        return finalName;
    }
}
