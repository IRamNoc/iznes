import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {get as getValue} from 'lodash';

import {countries} from '../../../requests.config';
import {NewRequestService} from '../../new-request.service';

@Component({
    selector: 'general-information',
    templateUrl: './general-information.component.html'
})
export class GeneralInformationComponent implements OnInit {

    @Input() form: FormGroup;

    open: boolean = false;
    countries = countries;
    legalFormList;
    sectorActivityList;
    legalStatusList;
    legalStatusInsurerTypeList;
    publicEstablishmentList;

    constructor(
        private newRequestService: NewRequestService
    ) {
    }

    ngOnInit() {
        this.legalFormList = this.newRequestService.legalFormList;
        this.sectorActivityList = this.newRequestService.sectorActivityList;
        this.legalStatusList = this.newRequestService.legalStatusList;
        this.legalStatusInsurerTypeList = this.newRequestService.legalStatusInsurerTypeList;
        this.publicEstablishmentList = this.newRequestService.publicEstablishmentList;

        this.initFormCheck();
    }

    initFormCheck() {
        this.form.get('legalStatus').valueChanges.subscribe(data => {
            let legalStatusValue = getValue(data, [0, 'id']);

            this.formCheckLegalStatus(legalStatusValue);
        });

        this.form.get('sectorActivity').valueChanges.subscribe(data => {
            let sectorActivityValue = getValue(data, [0, 'id']);

            this.formCheckSectorActivity(sectorActivityValue);
        });
    }

    formCheckSectorActivity(value) {
        let form = this.form;
        let sectorActivityTextControl = form.get('sectorActivityText');

        if (value === 'other') {
            sectorActivityTextControl.enable();
        } else {
            sectorActivityTextControl.disable();
        }
    }

    formCheckLegalStatus(value) {
        let form = this.form;
        let controls = ['legalStatusListingMarkets', 'legalStatusInsurerType', 'legalStatusPublicEstablishmentType', 'legalStatusListingOther'];

        for (const control of controls) {
            form.get(control).disable();
        }

        switch (value) {
            case 'listedCompany':
                form.get('legalStatusListingMarkets').enable();
                break;
            case 'insurer':
                form.get('legalStatusInsurerType').enable();
                break;
            case 'publicEstablishment' :
                form.get('legalStatusPublicEstablishmentType').enable();
                break;
            case 'other' :
                form.get('legalStatusListingOther').enable();
                break;
        }
    }

    shouldDisplay(controlName) {
        const form = this.form;

        const legalStatusControl = form.get('legalStatus');
        const legalStatusValue = getValue(legalStatusControl, ['value', 0, 'id']);

        const sectorActivityControl = form.get('sectorActivity');
        const sectorActivityValue = getValue(sectorActivityControl, ['value', 0, 'id']);

        switch (controlName) {
            case 'legalStatusListingMarkets':
                return legalStatusValue === 'listedCompany';
            case 'legalStatusInsurerType':
                return legalStatusValue === 'insurer';
            case 'legalStatusPublicEstablishmentType' :
                return legalStatusValue === 'publicEstablishment';
            case 'legalStatusListingOther' :
                return legalStatusValue === 'other';
            case 'sectorActivityText' :
                return sectorActivityValue === 'other';
        }
    }
    
    hasError(control, error = []){
        return this.newRequestService.hasError(this.form, control, error);
    }
}