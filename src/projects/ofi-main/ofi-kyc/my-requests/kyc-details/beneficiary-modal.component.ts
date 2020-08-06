import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { KycDetailsService } from './details.service';
import { mapValues, find } from 'lodash';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'kyc-details-stakeholder-modal',
    templateUrl: './beneficiary-modal.component.html',
})
export class KycDetailsStakeholdersModalComponent implements OnInit {
    @Input() stakeholder;
    @Input() registeredCompanyName;
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

    constructor(
        private translateService: MultilingualService,
    ) {
    }

    ngOnInit() {
    }

    closeModal() {
        this.close.emit();
    }

    percentageType(percentage) {

        const onlyIntValue = percentage.replace(/\D/g,'');

        if (onlyIntValue >= 1 && onlyIntValue < 10)
            return this.translateService.translate("1 to less than 10 %");
        else if (onlyIntValue >= 10 && onlyIntValue < 25)
            return this.translateService.translate("10 to less than 25 %");
        else if (onlyIntValue >= 25 && onlyIntValue < 33)
            return this.translateService.translate("25 to less than 33 %");
        else if (onlyIntValue >= 33 && onlyIntValue < 50)
            return this.translateService.translate("33 to less than 50 %");
        else if (onlyIntValue >= 50 && onlyIntValue < 66)
            return this.translateService.translate("50 to less than 66 %");
        else if (onlyIntValue >= 66 && onlyIntValue < 75)
            return this.translateService.translate("66 to less than 75 %");
        else if (onlyIntValue >= 75 && onlyIntValue < 90)
            return this.translateService.translate("75 to less than 90 %");
        else if (onlyIntValue >= 90 && onlyIntValue < 100)
            return this.translateService.translate("90 to less than 100 %");
        return percentage
    }

}
