import {IDate} from '../common/models/date.model';
import {DomHelper} from '../common/services/dom-appender/dom-appender.service';
import {UtilsService} from '../common/services/utils/utils.service';
import {CalendarMode} from '../common/types/calendar-mode';
import {ECalendarMode} from '../common/types/calendar-mode-enum';
import {CalendarValue} from '../common/types/calendar-value';
import {ECalendarValue} from '../common/types/calendar-value-enum';
import {SingleCalendarValue} from '../common/types/single-calendar-value';
import {IDayCalendarConfig} from '../day-calendar/day-calendar-config.model';
import {DayCalendarComponent} from '../day-calendar/day-calendar.component';
import {DayCalendarService} from '../day-calendar/day-calendar.service';
import {IDayTimeCalendarConfig} from '../day-time-calendar/day-time-calendar-config.model';
import {DayTimeCalendarService} from '../day-time-calendar/day-time-calendar.service';
import {ITimeSelectConfig} from '../time-select/time-select-config.model';
import {TimeSelectComponent} from '../time-select/time-select.component';
import {TimeSelectService} from '../time-select/time-select.service';
import {IDatePickerConfig} from './date-picker-config.model';
import {IDpDayPickerApi} from './date-picker.api';
import {DatePickerService} from './date-picker.service';
import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator
} from '@angular/forms';
import * as moment from 'moment';
import {Moment, unitOfTime} from 'moment';

@Component({
    selector: 'dp-date-picker',
    templateUrl: 'date-picker.component.html',
    styleUrls: ['date-picker.component.less'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        DatePickerService,
        DayTimeCalendarService,
        DayCalendarService,
        TimeSelectService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements OnChanges,
    OnInit,
    AfterViewInit,
    ControlValueAccessor,
    Validator,
    OnDestroy {
    isInitialized: boolean = false;
    @Input() config: IDatePickerConfig;
    @Input() mode: CalendarMode = 'day';
    @Input() placeholder: string = '';
    @Input() disabled: boolean = false;
    @Input() displayDate: SingleCalendarValue;
    @HostBinding('class') @Input() theme: string;
    @Input() minDate: Moment | string;
    @Input() maxDate: Moment | string;
    @Input() minTime: Moment | string;
    @Input() maxTime: Moment | string;

    @Output() open = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();
    @Output() selectedDate = new EventEmitter<Moment[]>();

    @ViewChild('container') calendarContainer: ElementRef;
    @ViewChild('dayCalendar') dayCalendarRef: DayCalendarComponent;
    @ViewChild('monthCalendar') monthCalendarRef: DayCalendarComponent;
    @ViewChild('timeSelect') timeSelectRef: TimeSelectComponent;

    componentConfig: IDatePickerConfig;
    dayCalendarConfig: IDayCalendarConfig;
    dayTimeCalendarConfig: IDayTimeCalendarConfig;
    timeSelectConfig: ITimeSelectConfig;
    _areCalendarsShown: boolean = false;
    hideStateHelper: boolean = false;
    _selected: Moment[] = [];
    inputValue: CalendarValue;
    inputValueType: ECalendarValue;
    isFocusedTrigger: boolean = false;
    currentDateView: Moment;
    inputElementValue: string;
    calendarWrapper: HTMLElement;
    appendToElement: HTMLElement;
    inputElementContainer: HTMLElement;
    popupElem: HTMLElement;
    handleInnerElementClickUnlisteners: Function[] = [];
    globalListnersUnlisteners: Function[] = [];
    validateFn: (inputVal: CalendarValue) => { [key: string]: any };
    api: IDpDayPickerApi = {
        open: this.showCalendars.bind(this),
        close: this.hideCalendar.bind(this)
    };

    set selected(selected: Moment[]) {
        this._selected = selected;
        this.inputElementValue = (<string[]>this.utilsService
            .convertFromMomentArray(this.componentConfig.format, selected, ECalendarValue.StringArr))
            .join(', ');
        this.onChangeCallback(this.processOnChangeCallback(selected));
        this.selectedDate.emit(this._selected);
    }

    get selected(): Moment[] {

        return this._selected;
    }

    get areCalendarsShown(): boolean {
        return this._areCalendarsShown;
    }

    get openOnFocus(): boolean {
        return this.componentConfig.openOnFocus;
    }

    get openOnClick(): boolean {
        return this.componentConfig.openOnClick;
    }

    set areCalendarsShown(value: boolean) {
        if (value) {
            this.startGlobalListeners();
            this.domHelper.appendElementToPosition({
                container: this.appendToElement,
                element: this.calendarWrapper,
                anchor: this.inputElementContainer,
                dimElem: this.popupElem,
                drops: this.componentConfig.drops,
                opens: this.componentConfig.opens
            });
        } else {
            this.stopGlobalListeners();
            this.dayPickerService.pickerClosed();
        }

        this._areCalendarsShown = value;
    }

    constructor(private dayPickerService: DatePickerService,
                private domHelper: DomHelper,
                private elemRef: ElementRef,
                private renderer: Renderer,
                private utilsService: UtilsService,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    @HostListener('click')
    onClick() {
        if (!this.openOnClick) {
            return;
        }

        if (!this.isFocusedTrigger && !this.disabled) {
            this.hideStateHelper = true;
            if (!this.areCalendarsShown) {
                this.showCalendars();
            }
        }
    }

    @HostListener('document:click')
    onBodyClick() {
        if (!this.hideStateHelper && this.areCalendarsShown) {
            this.hideCalendar();
        }

        this.hideStateHelper = false;
    }

    @HostListener('document:scroll')
    @HostListener('window:resize')
    onScroll() {
        if (this.areCalendarsShown) {
            this.domHelper.setElementPosition({
                container: this.appendToElement,
                element: this.calendarWrapper,
                anchor: this.inputElementContainer,
                dimElem: this.popupElem,
                drops: this.componentConfig.drops,
                opens: this.componentConfig.opens
            });
        }
    }

    writeValue(value: CalendarValue): void {
        this.inputValue = value;

        if (value) {
            this.selected = this.utilsService
                .convertToMomentArray(value, this.componentConfig.format, this.componentConfig.allowMultiSelect);
            this.init();
        } else {
            this.selected = [];
        }
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    onChangeCallback(_: any) {
    };

    registerOnTouched(fn: any): void {
    }


    validate(formControl: FormControl): ValidationErrors | any {
        if (this.minDate || this.maxDate || this.minTime || this.maxTime) {
            return this.validateFn(formControl.value);
        } else {
            return () => null;
        }
    }

    processOnChangeCallback(selected: Moment[]): CalendarValue {
        return this.utilsService.convertFromMomentArray(this.componentConfig.format, selected, this.inputValueType);
    }

    initValidators() {
        this.validateFn = this.utilsService.createValidator(
            {
                minDate: this.minDate,
                maxDate: this.maxDate,
                minTime: this.minTime,
                maxTime: this.maxTime
            }, this.componentConfig.format, this.mode);
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    }

    ngOnInit() {
        this.isInitialized = true;
        this.init();
        this.initValidators();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isInitialized) {
            const {minDate, maxDate, minTime, maxTime} = changes;
            this.init();

            if (minDate || maxDate || minTime || maxTime) {
                this.initValidators();
            }
        }
    }

    ngAfterViewInit() {
        this.setElementPositionInDom();
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }

    setElementPositionInDom() {
        this.calendarWrapper = <HTMLElement> this.calendarContainer.nativeElement;
        this.setInputElementContainer();
        this.popupElem = this.elemRef.nativeElement.querySelector('.dp-popup');
        this.handleInnerElementClick(this.popupElem);

        const {appendTo} = this.componentConfig;
        if (appendTo) {
            if (typeof appendTo === 'string') {
                this.appendToElement = <HTMLElement>document.querySelector(<string>appendTo);
            } else {
                this.appendToElement = <HTMLElement>appendTo;
            }
        } else {
            this.appendToElement = this.elemRef.nativeElement;
        }

        this.appendToElement.appendChild(this.calendarWrapper);
    }

    setInputElementContainer() {
        this.inputElementContainer = this.componentConfig.inputElementContainer
            || this.elemRef.nativeElement.querySelector('.dp-input-container')
            || document.body;
    }

    handleInnerElementClick(element: HTMLElement) {
        this.handleInnerElementClickUnlisteners.push(
            this.renderer.listen(element, 'click', () => {
                this.hideStateHelper = true;
            })
        );
    }

    init() {
        this.componentConfig = this.dayPickerService.getConfig(this.config, this.mode);
        this.currentDateView = this.displayDate
            ? this.utilsService.convertToMoment(this.displayDate, this.componentConfig.format).clone()
            : this.utilsService
                .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect);
        this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        this.dayCalendarConfig = this.dayPickerService.getDayConfigService(this.componentConfig);
        this.dayTimeCalendarConfig = this.dayPickerService.getDayTimeConfigService(this.componentConfig);
        this.timeSelectConfig = this.dayPickerService.getTimeConfigService(this.componentConfig);
    }

    inputFocused() {
        if (!this.openOnFocus) {
            return;
        }

        this.isFocusedTrigger = true;
        setTimeout(() => {
            this.hideStateHelper = false;

            if (!this.areCalendarsShown) {
                this.showCalendars();
            }

            this.isFocusedTrigger = false;
        }, this.componentConfig.onOpenDelay);
    }

    showCalendars() {
        this.hideStateHelper = true;
        this.areCalendarsShown = true;

        if (this.timeSelectRef) {
            this.timeSelectRef.api.triggerChange();
        }

        this.open.emit();
        this.changeDetectorRef.markForCheck();
    }

    hideCalendar() {
        this.areCalendarsShown = false;

        if (this.dayCalendarRef) {
            this.dayCalendarRef.api.toggleCalendar(ECalendarMode.Day);
        }

        this.close.emit();
        this.changeDetectorRef.markForCheck();
    }

    onViewDateChange(value: string) {
        if (this.dayPickerService.isValidInputDateValue(value, this.componentConfig)) {
            this.selected = this.dayPickerService.convertInputValueToMomentArray(value, this.componentConfig);
            this.currentDateView = this.selected.length
                ? this.utilsService.getDefaultDisplayDate(null, this.selected, this.componentConfig.allowMultiSelect)
                : this.currentDateView;
        }
    }

    shouldShowGoToCurrent(): boolean {
        return this.componentConfig.showGoToCurrent && this.mode !== 'time';
    }

    moveToCurrent() {
        this.currentDateView = moment();
    }

    dateSelected(date: IDate, granularity: unitOfTime.Base, ignoreClose?: boolean) {
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, date, granularity);
        if (!ignoreClose) {
            this.onDateClick();
        }
    }

    onDateClick() {
        if (this.componentConfig.closeOnSelect) {
            setTimeout(this.hideCalendar.bind(this), this.componentConfig.closeOnSelectDelay);
        }
        this.hideCalendar();
    }

    onKeyPress(event: KeyboardEvent) {
        switch (event.keyCode) {
            case (9):
            case (27):
                this.hideCalendar();
                break;
        }
    }

    startGlobalListeners() {
        this.globalListnersUnlisteners.push(
            this.renderer.listen(document, 'keydown', (e: KeyboardEvent) => {
                this.onKeyPress(e);
            }));
    }

    stopGlobalListeners() {
        this.globalListnersUnlisteners.forEach((ul) => ul());
        this.globalListnersUnlisteners = [];
    }

    ngOnDestroy() {
        this.handleInnerElementClickUnlisteners.forEach(ul => ul());
        this.appendToElement.removeChild(this.calendarWrapper);
    }
}
