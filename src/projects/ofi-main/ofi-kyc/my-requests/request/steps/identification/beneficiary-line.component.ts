import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { get as getValue, find } from 'lodash';
import { NewRequestService } from '../../new-request.service';
import { countries } from '../../../requests.config';
import { MultilingualService } from '@setl/multilingual';

import { BeneficiaryService } from './beneficiary.service';

@Component({
    selector: '[beneficiary-line]',
    templateUrl: './beneficiary-line.component.html',
    styleUrls: ['./beneficiary-line.component.scss'],
})
export class BeneficiaryLineComponent {
    @Input() stakeholder;
    @Input() parent;
    @Input() registeredCompanyName;
    @Input() readOnly: boolean = false;
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

        return this.registeredCompanyName;
    }

    get countryTaxResidence() {
        const countryTaxResidenceText = getValue(this.stakeholderValue, 'common.countryTaxResidence[0].text');
        if (countryTaxResidenceText) return countryTaxResidenceText;

        return this.getAndSetStakeholderTextValues(countries, 'common.countryTaxResidence');
    }

    get nationality() {
        const nationalityText = getValue(this.stakeholderValue, 'common.nationality[0].text');
        if (nationalityText) return nationalityText;

        return this.getAndSetStakeholderTextValues(countries, 'common.nationality');
    }

    get holdingPercentage() {
        if (typeof getValue(this.stakeholderValue, 'common.holdingPercentage') === 'object' ){
            const holdingPercentageText = getValue(this.stakeholderValue, 'common.holdingPercentage[0].text');
            if (holdingPercentageText) return holdingPercentageText;

            return this.translate.translate(this.getAndSetStakeholderTextValues(this.newRequestService.percentTypeList, 'common.holdingPercentage'));
        }

        const valueID = getValue(this.stakeholderValue, 'common.holdingPercentage');
        return this.translate.translate((this.newRequestService.percentTypeList.find(item => item.id === valueID) || {}).text);
    }

    get holdingType() {
        const holdingTypeText = getValue(this.stakeholderValue, 'common.holdingType[0].text');
        if (holdingTypeText) return holdingTypeText;

        return this.getAndSetStakeholderTextValues(this.newRequestService.holdingTypesList, 'common.holdingType');
    }

    get relationType() {
        const relationText = getValue(this.stakeholderValue, 'common.relationType[0].text');
        if (relationText) return relationText;

        return this.getAndSetStakeholderTextValues(this.newRequestService.relationTypesList, 'common.relationType');
    }

    get votingPercentage() {
        if (typeof getValue(this.stakeholderValue, 'common.votingPercentage') === 'object' ){
            const votingPercentageText = getValue(this.stakeholderValue, 'common.votingPercentage[0].text');
            if (votingPercentageText) return votingPercentageText;
    
            return this.translate.translate(this.getAndSetStakeholderTextValues(this.newRequestService.percentTypeList, 'common.votingPercentage'));
        }
        const valueID = getValue(this.stakeholderValue, 'common.holdingPercentage');
        return this.translate.translate((this.newRequestService.percentTypeList.find(item => item.id === valueID) || {}).text);
    }

    constructor(
        private beneficiaryService: BeneficiaryService,
        private element: ElementRef,
        private newRequestService: NewRequestService,
        public translate: MultilingualService,
    ) {
    }

    getAndSetStakeholderTextValues(list, formControlPath) {
        const controlValue = getValue(this.stakeholderValue, `${formControlPath}`, '');
        const valueID = getValue(controlValue, '[0].id');
        if (!valueID) return '';
        controlValue[0].text = (list.find(item => item.id === valueID) || {}).text || '';
        return controlValue[0].text;
    }

    /**
     * Handle displaying the actions list
     * @param event
     */
    @HostListener('document:click', ['$event']) clickOutside(e) {
        const actionIcon = this.element.nativeElement.querySelector('.datagrid-row');
        this.showActions = actionIcon ? actionIcon.contains(e.target) : false;
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
