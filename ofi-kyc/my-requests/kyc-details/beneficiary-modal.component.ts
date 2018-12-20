import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { KycDetailsService } from './details.service';
import { mapValues, find } from 'lodash';

@Component({
    selector: 'kyc-details-stakeholder-modal',
    templateUrl: './beneficiary-modal.component.html',
})
export class KycDetailsStakeholdersModalComponent implements OnInit {

    @Input() stakeholder;
    @Output() close: EventEmitter<void> = new EventEmitter();

    set open(value) {
        this.isOpen = value;

        if (!value) {
            this.close.emit();
        }
    }

    get open() {
        return this.isOpen;
    }

    get name() {
        const type = this.stakeholder.type;

        if (type === 'legalPerson') {
            return this.stakeholder.legalName;
        }

        if (type === 'naturalPerson') {
            return `${this.stakeholder.firstName} ${this.stakeholder.lastName}`;
        }
    }

    isOpen = true;

    constructor() {
    }

    ngOnInit() {
    }

    closeModal() {
        this.close.emit();
    }

}
