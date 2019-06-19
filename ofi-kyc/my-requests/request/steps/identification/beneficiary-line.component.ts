import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { get as getValue, find } from 'lodash';

import { BeneficiaryService } from './beneficiary.service';

@Component({
    selector: '[beneficiary-line]',
    templateUrl: './beneficiary-line.component.html',
    styleUrls: ['./beneficiary-line.component.scss'],
})
export class BeneficiaryLineComponent {
    @Input() stakeholder;
    @Input() parent;
    @Output() action: EventEmitter<any> = new EventEmitter<any>();
    showActions: boolean = false;

    get stakeholderValue() {
        return this.stakeholder.value;
    }

    get beneficiaryType() {
        return this.beneficiaryService.getStakeholderType(this.stakeholder);
    }

    get name() {
        return this.beneficiaryService.getDisplayName(this.stakeholder);
    }

    get parentText() {
        if (this.parent) {
            return this.parent.text;
        }
    }

    get countryTaxResidence() {
        return getValue(this.stakeholderValue, 'common.countryTaxResidence[0].text');
    }

    get nationality() {
        return getValue(this.stakeholderValue, 'common.nationality[0].text');
    }

    get holdingPercentage() {
        return getValue(this.stakeholderValue, 'common.holdingPercentage');
    }

    get holdingType() {
        return getValue(this.stakeholderValue, 'common.holdingType[0].text');
    }

    get relationType() {
        return getValue(this.stakeholderValue, 'common.relationType[0].text');
    }

    get votingPercentage() {
        return getValue(this.stakeholderValue, 'common.votingPercentage');
    }

    constructor(
        private beneficiaryService: BeneficiaryService,
        private element: ElementRef,
    ) {
    }

    /**
     * Handle displaying the actions list
     * @param event
     */
    @HostListener('document:click', ['$event']) clickOutside(e) {
        const actionIcon = this.element.nativeElement.querySelector('.datagrid-row');
        this.showActions = actionIcon.contains(e.target);
    }

    addChild() {
        this.action.emit('addChild');
    }

    editStakeholder() {
        this.action.emit('edit');
    }

    removeStakeholder() {
        this.action.emit('remove');
    }
}
