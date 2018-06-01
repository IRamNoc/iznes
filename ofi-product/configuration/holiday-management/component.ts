import {
    Component,
    OnInit, OnDestroy,
    ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';

import { HolidayMgmtMDateHelper } from './helpers/date';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-product-configuration-holiday-mgmt',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProductConfigurationHolidayMgmtComponent implements OnInit, OnDestroy {
    form: FormGroup;
    dateConfig;
    selectedDates: moment.Moment[];

    constructor() {
        this.initForm();
        this.initDateConfig();
    }

    ngOnInit() {}

    private initForm(): void {
        this.form = new FormGroup({
            excludeWeekends: new FormControl(false),
        });

        this.form.controls.excludeWeekends.valueChanges.subscribe((value) => {
            const arr = [];

            this.selectedDates.forEach((date: moment.Moment, index: number) => {
                if (date.isoWeekday() < 6) {
                    arr.push(date);
                }
            });

            this.selectedDates = arr;
        });
    }

    private initDateConfig(): void {
        this.dateConfig = {
            allowMultiSelect: true,
            disableKeypress: true,
            firstDayOfWeek: 'mo',
            format: 'YYYY-MM-DD',
            isDayDisabledCallback: (date: moment.Moment) => this.isDayDisabled(date),
            locale: null,
            theme: 'dp-material',
        };
    }

    private isDayDisabled(date: moment.Moment): boolean {
        if (this.form.value.excludeWeekends === true && date.isoWeekday() > 5) {
            return true;
        }

        return false;
    }

    clear(): void {
        this.selectedDates = [];
        this.form.controls.excludeWeekends.setValue(false);
    }

    ngOnDestroy() {}
}
