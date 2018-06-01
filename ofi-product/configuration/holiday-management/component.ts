import {
    Component,
    OnInit, OnDestroy,
    ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';

import { HolidayMgmtDateHelper } from './helpers/date';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-product-configuration-holiday-mgmt',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProductConfigurationHolidayMgmtComponent implements OnInit, OnDestroy {
    form: FormGroup;
    dateConfig;
    selectedDates: moment.Moment[] = [];

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
        this.selectedDates = [];
        this.form.controls.excludeWeekends.setValue(false);
    }

    ngOnDestroy() {}
}
