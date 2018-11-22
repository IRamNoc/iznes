import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { get as getValue, find } from 'lodash';

import { BeneficiaryService } from './beneficiary.service';

@Component({
    selector: '[beneficiary-line]',
    templateUrl: './beneficiary-line.component.html',
    styleUrls: ['./beneficiary-line.component.scss'],
})
export class BeneficiaryLineComponent {

    @HostListener('mouseenter') onEnter() {
        this.hovering = true;
    }
    @HostListener('mouseleave') onLeave() {
        this.hovering = false;
    }
    @Input() stakeholder;
    @Output() action: EventEmitter<any> = new EventEmitter<any>();

    hovering: boolean = false;

    get stakeholderValue() {
        return this.stakeholder.value;
    }

    get beneficiaryType() {
        return this.beneficiaryService.getStakeholderType(this.stakeholder);
    }

    get name() {
        return this.beneficiaryService.getDisplayName(this.stakeholder);
    }

    get parent() {
        return getValue(this.stakeholderValue, 'common.parent[0].text');
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

    get votingPercentage() {
        return getValue(this.stakeholderValue, 'common.votingPercentage');
    }

    constructor(
        private beneficiaryService: BeneficiaryService,
    ) {}

    handleActionsClick($event: Event) {
        $event.stopPropagation();
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
