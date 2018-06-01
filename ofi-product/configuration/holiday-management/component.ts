import {
    Component, Input, Output, EventEmitter,
    OnInit, OnDestroy,
    ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';
import * as moment from 'moment';

import { ConfirmationService } from '@setl/utils';
import { HolidayMgmtDateHelper } from './helpers/date';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-product-configuration-holiday-mgmt',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProductConfigurationHolidayMgmtComponent implements OnInit, OnDestroy {
    @Input() showClearButton: boolean = true;
    @Input() showWeekendToggle: boolean = true;
    @Input() areYouSureMessage: string = '';
    @Input() dateConfig: any;

    @Output() datesEmitter: EventEmitter<() => string[]> = new EventEmitter();

    form: FormGroup;
    selectedDates: moment.Moment[] = [];

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private confirmationService: ConfirmationService,
                private toaster: ToasterService) {
        this.initForm();
    }

    ngOnInit() {
        this.initDateConfig();
        this.datesEmitter.emit((() => { return this.datesAsStrings; }));
    }

    get datesAsStrings(): string[] {
        const arr = [];

        _.forEach(this.selectedDates, (e: moment.Moment) => {
            arr.push(e.format('YYYY-MM-DD'));
        });

        return arr;
    }

    private initForm(): void {
        this.form = new FormGroup({
            excludeWeekends: new FormControl(false),
        });

        this.form.controls.excludeWeekends.valueChanges.subscribe((value) => {
            if (value) {
                this.selectedDates =
                    HolidayMgmtDateHelper.addWeekendsToArray(this.selectedDates,
                                                             moment(),
                                                             moment().add(2, 'year'));
            } else {
                this.selectedDates =
                    HolidayMgmtDateHelper.removeWeekendsFromArray(this.selectedDates);
            }
        });
    }

    private initDateConfig(): void {
        if (this.dateConfig !== undefined) return;

        this.dateConfig = {
            allowMultiSelect: true,
            disableKeypress: true,
            firstDayOfWeek: 'mo',
            format: 'YYYY-MM-DD',
            locale: null,
            min: moment(),
            max: moment().add(2, 'year'),
            theme: 'dp-material',
        };
    }

    clear(): void {
        this.confirmationService.create(
            '<span>Are you sure?</span>',
            '<span>' + this.areYouSureMessage + '</span>',
            { confirmText: 'Confirm', declineText: 'Cancel' },
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.selectedDates = [];
                this.form.controls.excludeWeekends.setValue(false);

                this.changeDetectorRef.markForCheck();
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    ngOnDestroy() {}
}
