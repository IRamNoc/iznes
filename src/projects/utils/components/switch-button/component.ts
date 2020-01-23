import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Input,
    ChangeDetectorRef,
    Output,
    EventEmitter,
    forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const noop = () => {
};

interface Config {
    buttonsText: string[];
    disabled: boolean;
}

@Component({
    selector: 'app-switch-button',
    template: `
        <div data-toggle="buttons-checkbox" class="btn-group">
            <button class="btn btn-primary byUnit" (click)="writeValue(0)" type="button" [class.btn-primary]="value === 0"
                    [class.btn-default]="value === 1" [disabled]="config.disabled">
                <span class="ml_translated" mltag="txt_quantity">{{config.buttonsText[0]}}</span>
            </button>

            <button class="btn btn-default byAmount" type="button" (click)="writeValue(1)" [class.btn-primary]="value === 1"
                    [class.btn-default]="value === 0" [disabled]="config.disabled">
                <span class="ml_translated" mltag="txt_amount">{{config.buttonsText[1]}}</span>
            </button>
        </div>
    `,
    styles: [`
            .btn-primary {
                -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, .075);
                box-shadow: inset 0 3px 5px rgba(0, 0, 0, .075);
                outline: 0;
            }

            .btn-primary span {
                color: white;
            }

            .btn.btn-primary:disabled {
                border-color: #565656;
            }
            `]
    ,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SwitchButtonComponent),
        multi: true,
    }],
})

export class SwitchButtonComponent implements ControlValueAccessor {
    @Input() value: number;
    @Input() config: Config;
    @Output() public updateValue: EventEmitter<any> = new EventEmitter();

    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    constructor(private changeDetectorRef: ChangeDetectorRef) {
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
