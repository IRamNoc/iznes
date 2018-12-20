import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KycDetailsService } from './details.service';

@Component({
    selector: 'kyc-details-grid',
    templateUrl: './details-grid.component.html',
    styleUrls : ['./details-grid.component.scss'],
})
export class KycDetailsGridComponent {
    @Input() data;
    @Input() id;
    @Output() open: EventEmitter<string> = new EventEmitter();

    constructor(
        private kycDetailsService : KycDetailsService,
    ) {}

    openBeneficiaries($event) {
        $event.preventDefault();

        this.open.emit('beneficiaries');
    }

    isFromForm(id) {
        return this.kycDetailsService.isFromForm(id);
    }

    split(value: string) {
        return value.split('|');
    }
}
