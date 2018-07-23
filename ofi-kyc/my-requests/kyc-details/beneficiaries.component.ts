import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {isEmpty} from 'lodash';

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

}