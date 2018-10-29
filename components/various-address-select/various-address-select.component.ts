import { Component, forwardRef, Input, OnChanges } from '@angular/core';
import {
    FormControl,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS,
    Validators,
} from '@angular/forms';
import { MultilingualService } from '@setl/multilingual';
import * as _ from 'lodash';

const noop = () => {
};

@Component({
    selector: 'various-address-select',
    templateUrl: 'various-address-select.component.html',
    styleUrls: ['various-address-select.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => VariousAddressSelectComponent),
        multi: true,
    }],
})
export class VariousAddressSelectComponent implements ControlValueAccessor {
    @Input() ownWalletAddressArray = [
        { id: 1, text: '2 Connection' },
        { id: 2, text: 'Owned Address' },
        { id: 3, text: 'Other Address' },
    ];
    @Input() relationshipArray = [
        { id: 1, text: '1 Connection' },
        { id: 2, text: 'Owned Address' },
        { id: 3, text: 'Other Address' },
    ];
    @Input() required: boolean = false;
    addressTypes = [
        { id: 1, text: 'Connection' },
        { id: 2, text: 'Owned Address' },
        { id: 3, text: 'Other Address' },
    ];

    selectedAddressType = 1;

    addressTypeSelect = new FormControl([{ id: 1, text: 'Connection' }]);
    relationshipSelect = new FormControl('', Validators.required);
    ownedAddressSelect = new FormControl('', Validators.required);
    otherAddress = new FormControl('', Validators.required);

    otherAddressValidationTooltipText;

    constructor(private translate: MultilingualService) {
        this.otherAddressValidationTooltipText =
        `${this.translate.translate('Address must be 34 characters and satisfy the following rules')}:
            <ul class="mt-1">
                <li>${this.translate.translate('Start with an')} 'A'</li>
                <li>${this.translate.translate('End with either an')} 
                'A', 'Q', 'g' ${this.translate.translate('or')} 'w'</li>
                <li>${this.translate.translate('Be comprised of only')}:
                    <ul>
                        <li>A–Z</li>
                        <li>a–z</li>
                        <li>0–9</li>
                        <li>- (${this.translate.translate('hyphen')})</li>
                        <li>_ (${this.translate.translate('underscore')})</li>
                    </ul>
                </li>
            </ul>`;
    }

    // The internal data model
    private innerValue: any = '';

    // Placeholders for the callbacks which are later provided by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    // Set touched on blur
    onBlur() {
        this.onTouchedCallback();
    }

    setSelectedAddressType($event) {
        this.selectedAddressType = $event.id;
    }

    // Clear value when field is cleared
    onClearValue() {
        this.writeValue('');
    }

    // From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
            this.setFormControlsValue(value);
            this.onChangeCallback(value);
        }
    }

    // From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    // From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    // Set value in view
    setFormControlsValue(value) {
        let ng2SelectValue;

        switch (this.selectedAddressType) {
        case 1:
            if (_.get(this.relationshipSelect, 'value[0].id', null) === value) {
                return true;
            }
            ng2SelectValue = this.relationshipArray.reduce(
                (result, currentValue) => {
                    if (currentValue.id === value) {
                        result.push(currentValue);
                    }
                    return result;
                },
                [],
            );

            this.relationshipSelect.setValue(ng2SelectValue);
            break;

        case 2:
            if (_.get(this.ownedAddressSelect, 'value[0].id', null) === value) {
                return true;
            }
            ng2SelectValue = this.ownWalletAddressArray.reduce(
                (result, currentValue) => {
                    if (currentValue.id === value) {
                        result.push(currentValue);
                    }
                    return result;
                },
                [],
            );
            this.ownedAddressSelect.setValue(ng2SelectValue);
            break;

        case 3:
            if (this.otherAddress.value === value) {
                return true;
            }
            this.otherAddress.setValue(value);
            break;
        }
    }
}
