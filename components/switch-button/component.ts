import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Input,
    ChangeDetectorRef,
    Output,
    EventEmitter
} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';

const noop = () => {
};

interface Config {
    buttonsText: Array<string>;
}

@Component({
    selector: 'app-switch-button',
    template: `
        <div data-toggle="buttons-checkbox" class="btn-group">
            <button class="btn btn-primary byUnit" (click)="writeValue(0)" type="button" [class.btn-primary]="value === 0"
                    [class.btn-default]="value === 1">
                <span class="ml_translated" mltag="txt_quantity">{{config.buttonsText[0]}}</span>
            </button>

            <button class="btn btn-default byAmount" type="button" (click)="writeValue(1)" [class.btn-primary]="value === 1"
                    [class.btn-default]="value === 0">
                <span class="ml_translated" mltag="txt_amount">{{config.buttonsText[1]}}</span>
            </button>
        </div>
    `,
    styles: [
            `
            .btn-primary {
                -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, .075);
                box-shadow: inset 0 3px 5px rgba(0, 0, 0, .075);
                outline: 0;
            }

            .btn-primary span {
                color: white;
            }

        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class SwitchButtonComponent implements ControlValueAccessor {

    @Input() value: number;
    @Input() config: Config;
    @Output() public updateValue: EventEmitter<any> = new EventEmitter();

    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;


    constructor(private _changeDetectorRef: ChangeDetectorRef) {
        this.value = 0;
    }

    // Set touched on blur
    onBlur() {
        this.onTouchedCallback();
    }

    // From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    // From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    writeValue(value: any) {
        this.value = value;
        this.updateValue.emit(value);
    }
}
