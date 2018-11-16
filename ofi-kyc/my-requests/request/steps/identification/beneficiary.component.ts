import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { get as getValue } from 'lodash';
import { RequestsService } from '../../../requests.service';
import { NewRequestService, configDate } from '../../new-request.service';
import { countries } from '../../../requests.config';
import { MultilingualService } from '@setl/multilingual';
import { BeneficiaryService } from './beneficiary.service';

@Component({
    selector: 'beneficiary',
    templateUrl: './beneficiary.component.html',
})
export class BeneficiaryComponent implements OnInit, OnDestroy {
    @Input() form;
    @Input() set parents(parents: any[]) {
        this.parentsFiltered = parents.filter((parent, i) => i !== this.index);
    }
    get parents() {
        return this.parentsFiltered;
    }
    @Input() index;
    @Input() disabled;

    @Output() refresh: EventEmitter<any> = new EventEmitter<any>();

    unsubscribe: Subject<any> = new Subject<any>();
    configDate;
    beneficiaryTypesList;
    holdingTypesList;
    identificationNumberList;
    countries;
    parentsFiltered;

    constructor(
        private requestsService: RequestsService,
        private newRequestService: NewRequestService,
        public translate: MultilingualService,
        private beneficiaryService: BeneficiaryService,
    ) {
        this.configDate = configDate;

        this.beneficiaryTypesList = this.newRequestService.beneficiaryTypesList;
        this.translate.translate(this.beneficiaryTypesList);

        this.holdingTypesList = this.newRequestService.holdingTypesList;
        this.translate.translate(this.holdingTypesList);
        this.identificationNumberList = this.newRequestService.identificationNumberList;
        this.countries = countries;
    }

    ngOnInit() {
        this.form.get('legalPerson').disable();
        this.form.get('naturalPerson').disable();

        this.initFormCheck();

        (this.form.get('beneficiaryType') as FormControl).updateValueAndValidity();
        (this.form.get('legalPerson.nationalIdNumber') as FormControl).updateValueAndValidity();
        this.refresh.emit();
    }

    initFormCheck() {
        this.form
        .get('beneficiaryType')
        .valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((beneficiaryTypeValue) => {
            this.formCheckBeneficiaryType(beneficiaryTypeValue);
        });

        this.form
        .get('legalPerson.nationalIdNumber')
        .valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((data) => {
            const nationalIdNumberValue = getValue(data, [0, 'id']);

            this.formCheckNationalIdNumber(nationalIdNumberValue);
        });
    }

    formCheckNationalIdNumber(value) {
        this.beneficiaryService.formCheckNationalIdNumber(this.form, value);

        this.refresh.emit();
    }

    formCheckBeneficiaryType(value) {
        this.beneficiaryService.formCheckBeneficiaryType(this.form, value);
    }

    uploadFile($event) {
        const formControl = this.form.get('naturalPerson.document');

        this.requestsService.uploadFile($event).then((file: any) => {
            formControl.get('hash').patchValue(file.fileHash);
            formControl.get('name').patchValue(file.fileTitle);
            formControl.get('kycDocumentID').patchValue('');
        });
    }

    isDisabled(path) {
        const control = this.form.get(path);

        return control.disabled;
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
