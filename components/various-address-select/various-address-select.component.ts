import {Component, forwardRef, Input, OnChanges} from '@angular/core';
import {
    FormControl,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS,
} from '@angular/forms';
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
        multi: true
    }]
})
export class VariousAddressSelectComponent implements ControlValueAccessor {

    @Input() ownWalletAddressArray = [
        {id: 1, text: '2 Relationship'},
        {id: 2, text: 'Owned Address'},
        {id: 3, text: 'Other Address'},
    ];
    @Input() relationshipArray = [
        {id: 1, text: '1 Relationship'},
        {id: 2, text: 'Owned Address'},
        {id: 3, text: 'Other Address'},
    ];
    @Input() required: boolean = false;
    addressTypes = [
        {id: 1, text: 'Relationship'},
        {id: 2, text: 'Owned Address'},
        {id: 3, text: 'Other Address'},
    ];

    selectedAddressType = 1;

    addressTypeSelect = new FormControl([{id: 1, text: 'Relationship'}]);
    relationshipSelect = new FormControl();
    owndAddressSelect = new FormControl();
    otherAddress = new FormControl();

    // The internal data model
    private innerValue: any = '';

    // Placeholders for the callbacks which are later providesd
    // by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    // Set touched on blur
    onBlur() {
        this.onTouchedCallback();
    }

    setSelectedAddressType($event) {
        this.selectedAddressType = $event.id;
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
                    }, []
                );

                this.relationshipSelect.setValue(ng2SelectValue);
                break;

            case 2:
                if (_.get(this.owndAddressSelect, 'value[0].id', null) === value) {
                    return true;
                }
                ng2SelectValue = this.ownWalletAddressArray.reduce(
                    (result, currentValue) => {
                        if (currentValue.id === value) {
                            result.push(currentValue);
                        }
                        return result;
                    }, []
                );
                this.owndAddressSelect.setValue(ng2SelectValue);
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
