import {FormGroup, FormControl} from '@angular/forms';
import * as E from '../../FundShareEnum';

export class FundShareTradeCycleModel {
    form: FormGroup;

    private _tradeCyclePeriod: string;
    private _numberOfPossibleWithinPeriod: number;
    private _weeklyDealingDays: string;
    private _monthlyDealingDays: string;
    private _yearlyDealingDays: string;
    
    constructor() {
        this.form = new FormGroup({
            tradeCyclePeriod: new FormControl(),
            possibleInPeriod: new FormControl(),
            weeklyDealingDays: new FormControl(),
            monthlyDealingDays: new FormControl(),
            yearlyDealingDays: new FormControl()
        });
    }
    
    get tradeCyclePeriod(): string {
        return this.form.value.tradeCyclePeriod ?
            this.form.value.tradeCyclePeriod[0].id :
            null;
    }
    set tradeCyclePeriod(value: string) {
        this.form.setValue({ tradeCyclePeriod: value });
    }
    get numberOfPossibleWithinPeriod(): number {
        return this.form.value.possibleInPeriod ?
            this.form.value.possibleInPeriod[0].id :
            null;
    }
    set numberOfPossibleWithinPeriod(value: number) {
        this.form.setValue({ possibleInPeriod: value });
    }
    get weeklyDealingDays(): string {
        return this.form.value.weeklyDealingDays ?
            this.form.value.weeklyDealingDays[0].id :
            null;
    }
    set weeklyDealingDays(value: string) {
        this.form.setValue({ weeklyDealingDays: value });
    }
    get monthlyDealingDays(): string {
        return this.form.value.monthlyDealingDays ?
            this.form.value.monthlyDealingDays[0].id :
            null;
    }
    set monthlyDealingDays(value: string) {
        this.form.setValue({ monthlyDealingDays: value });
    }
    get yearlyDealingDays(): string {
        return this.form.value.yearlyDealingDays ?
            this.form.value.yearlyDealingDays[0].id :
            null;
    }
    set yearlyDealingDays(value: string) {
        this.form.setValue({ yearlyDealingDays: value });
    }
}

export class TradeCycleModelDropdowns {
    tradeCyclePeriodItems = [
        { id: E.TradeCyclePeriodEnum.Daily, text: 'Daily' },
        { id: E.TradeCyclePeriodEnum.Weekly, text: 'Weekly' },
        { id: E.TradeCyclePeriodEnum.Monthly, text: 'Monthly' },
        { id: E.TradeCyclePeriodEnum.Yearly, text: 'Yearly' }
    ]
    weeklyDealingDaysItems = [
        { id: E.WeeklyDealingDaysEnum.FirstBusinessDay, text: 'First Business Day' },
        { id: E.WeeklyDealingDaysEnum.LastBusinessDay, text: 'Last Business Day' },
        { id: E.WeeklyDealingDaysEnum.Monday, text: 'Monday' },
        { id: E.WeeklyDealingDaysEnum.Tuesday, text: 'Tuesday' },
        { id: E.WeeklyDealingDaysEnum.Wednesday, text: 'Wednesday' },
        { id: E.WeeklyDealingDaysEnum.Thursday, text: 'Thursday' },
        { id: E.WeeklyDealingDaysEnum.Friday, text: 'Friday' }
    ]
    monthlyDealingDaysItems = [
        { id: E.MonthlyDealingDaysEnum.First, text: '1st' },
        { id: E.MonthlyDealingDaysEnum.Second, text: '2nd' },
        { id: E.MonthlyDealingDaysEnum.Third, text: '3rd' },
        { id: E.MonthlyDealingDaysEnum.Fourth, text: '4th' },
        { id: E.MonthlyDealingDaysEnum.Fifth, text: '5th' },
        { id: E.MonthlyDealingDaysEnum.Sixth, text: '6th' },
        { id: E.MonthlyDealingDaysEnum.Seventh, text: '7th' },
        { id: E.MonthlyDealingDaysEnum.Eigth, text: '8th' },
        { id: E.MonthlyDealingDaysEnum.Ninth, text: '9th' },
        { id: E.MonthlyDealingDaysEnum.Tenth, text: '10th' },
        { id: E.MonthlyDealingDaysEnum.Eleventh, text: '11th' },
        { id: E.MonthlyDealingDaysEnum.Twelfth, text: '12th' },
        { id: E.MonthlyDealingDaysEnum.Thirteenth, text: '13th' },
        { id: E.MonthlyDealingDaysEnum.Fourteenth, text: '14th' },
        { id: E.MonthlyDealingDaysEnum.Fifteenth, text: '15th' },
        { id: E.MonthlyDealingDaysEnum.Sixteenth, text: '16th' },
        { id: E.MonthlyDealingDaysEnum.Seventeenth, text: '17th' },
        { id: E.MonthlyDealingDaysEnum.Eighteenth, text: '18th' },
        { id: E.MonthlyDealingDaysEnum.Nineteenth, text: '19th' },
        { id: E.MonthlyDealingDaysEnum.Twentieth, text: '20th' },
        { id: E.MonthlyDealingDaysEnum.TwentyFirst, text: '21st' },
        { id: E.MonthlyDealingDaysEnum.TwentySecond, text: '22nd' },
        { id: E.MonthlyDealingDaysEnum.TwentyThird, text: '23rd' },
        { id: E.MonthlyDealingDaysEnum.TwentyFourth, text: '24th' },
        { id: E.MonthlyDealingDaysEnum.TwentyFifth, text: '25th' },
        { id: E.MonthlyDealingDaysEnum.TwentySixth, text: '26th' },
        { id: E.MonthlyDealingDaysEnum.TwentySeventh, text: '27th' },
        { id: E.MonthlyDealingDaysEnum.TwentyEigth, text: '28th' },
        { id: E.MonthlyDealingDaysEnum.TwentyNinth, text: '29th' },
        { id: E.MonthlyDealingDaysEnum.Thirtieth, text: '30th' },
        { id: E.MonthlyDealingDaysEnum.ThirtyFirst, text: '31st' },
        { id: E.MonthlyDealingDaysEnum.Last, text: 'Last day of Month' }
    ]
    yearlyDealingDaysItems = [
        { id: E.YearlyDealingDaysEnum.January, text: 'January' },
        { id: E.YearlyDealingDaysEnum.February, text: 'February' },
        { id: E.YearlyDealingDaysEnum.March, text: 'March' },
        { id: E.YearlyDealingDaysEnum.April, text: 'April' },
        { id: E.YearlyDealingDaysEnum.May, text: 'May' },
        { id: E.YearlyDealingDaysEnum.June, text: 'June' },
        { id: E.YearlyDealingDaysEnum.July, text: 'July' },
        { id: E.YearlyDealingDaysEnum.August, text: 'August' },
        { id: E.YearlyDealingDaysEnum.September, text: 'September' },
        { id: E.YearlyDealingDaysEnum.October, text: 'October' },
        { id: E.YearlyDealingDaysEnum.November, text: 'November' },
        { id: E.YearlyDealingDaysEnum.December, text: 'December' },
    ]
}