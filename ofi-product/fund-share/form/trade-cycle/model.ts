import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';
import * as E from '../../FundShareEnum';

export class FundShareTradeCycleModel {
    form: FormGroup;
    dropdownItems: TradeCycleModelDropdowns = new TradeCycleModelDropdowns();

    private _tradeCyclePeriod: string;
    private _numberOfPossibleWithinPeriod: number;
    private _weeklyDealingDays: string;
    private _monthlyDealingDays: string;
    private _yearlyDealingDays: string;

    constructor(
    ) {
        this.form = new FormGroup({
            tradeCyclePeriod: new FormControl(null, Validators.required),
            weeklyDealingDays: new FormControl(),
            monthlyDealingDays: new FormArray([]),
            yearlyDealingDays: new FormArray([]),
        });

        this.setupFormValueChange();
    }

    private setupFormValueChange(): void {
        this.form.controls.tradeCyclePeriod.valueChanges.subscribe((value: any) => {
            if (!!value) {
                if (value[0].id === E.TradeCyclePeriodEnum.Daily) {
                    this.form.controls.weeklyDealingDays.clearValidators();
                    (this.form.controls.monthlyDealingDays as FormArray).controls.forEach((c) => {
                        this.clearValidators(c);
                    });
                    (this.form.controls.yearlyDealingDays as FormArray).controls.forEach((c) => {
                        this.clearValidators(c);
                    });
                } else if (value[0].id === E.TradeCyclePeriodEnum.Weekly) {
                    this.form.controls.weeklyDealingDays.setValidators(Validators.required);
                    (this.form.controls.monthlyDealingDays as FormArray).controls.forEach((c) => {
                        this.clearValidators(c);
                    });
                    (this.form.controls.yearlyDealingDays as FormArray).controls.forEach((c) => {
                        this.clearValidators(c);
                    });
                } else if (value[0].id === E.TradeCyclePeriodEnum.Monthly) {
                    this.form.controls.weeklyDealingDays.clearValidators();
                    (this.form.controls.monthlyDealingDays as FormArray).controls.forEach((c) => {
                        this.setValidatorRequired(c);
                    });
                    (this.form.controls.yearlyDealingDays as FormArray).controls.forEach((c) => {
                        this.clearValidators(c);
                    });
                } else if (value[0].id === E.TradeCyclePeriodEnum.Yearly) {
                    this.form.controls.weeklyDealingDays.clearValidators();
                    (this.form.controls.monthlyDealingDays as FormArray).controls.forEach((c) => {
                        this.clearValidators(c);
                    });
                    (this.form.controls.yearlyDealingDays as FormArray).controls.forEach((c) => {
                        this.setValidatorRequired(c);
                    });
                }

                this.form.controls.weeklyDealingDays.updateValueAndValidity();
                (this.form.controls.monthlyDealingDays as FormArray).controls.forEach((c) => {
                    this.updateValueAndValidity(c);
                });
                (this.form.controls.yearlyDealingDays as FormArray).controls.forEach((c) => {
                    this.updateValueAndValidity(c);
                });
            }
        });
    }

    public reset() {
        this.form.reset();
    }

    public disable() {
        this.form.disable();
    }

    public clearAllValidators() {
        this.form.clearValidators();
        const controls = Object.keys(this.form.controls);
        controls.forEach((control) => {
            this.form.controls[control].clearValidators();
        });
    }

    private clearValidators(c): void {
        _.forEach((c as any).controls, (control => control.clearValidators()));
    }

    private setValidatorRequired(c): void {
        _.forEach((c as any).controls, (control => control.setValidators(Validators.required)));
    }

    private updateValueAndValidity(c): void {
        _.forEach((c as any).controls, (control => control.updateValueAndValidity()));
    }

    get tradeCyclePeriod(): number {
        return this.form.value.tradeCyclePeriod ? this.form.value.tradeCyclePeriod[0].id : null;
    }

    set tradeCyclePeriod(value: number) {
        this.form.controls.tradeCyclePeriod.setValue(
            this.getDropdownItemFromValue(this.dropdownItems.tradeCyclePeriodItems, value),
        );
    }

    get numberOfPossibleWithinPeriod(): number {
        const value = this.tradeCyclePeriod;
        let possible: number;

        if (value === E.TradeCyclePeriodEnum.Daily) {
            possible = 1;
        } else if (value === E.TradeCyclePeriodEnum.Weekly) {
            possible = this.weeklyDealingDays.length;
        } else if (value === E.TradeCyclePeriodEnum.Monthly) {
            possible = this.monthlyDealingDays.length;
        } else if (value === E.TradeCyclePeriodEnum.Yearly) {
            possible = this.yearlyDealingDays.length;
        }

        return possible;
    }

    get weeklyDealingDays(): any[] {
        return this.form.value.weeklyDealingDays ? this.form.value.weeklyDealingDays : [];
    }

    set weeklyDealingDays(value: any[]) {
        this.form.controls.weeklyDealingDays.setValue(value);
    }

    get monthlyDealingDays(): DealingDaysTerms[] {
        if (this.tradeCyclePeriod !== E.TradeCyclePeriodEnum.Monthly) return null;

        const arr = this.convertDealingDaysToArr(this.form.controls['monthlyDealingDays'] as FormArray);
        return arr;
    }

    set monthlyDealingDays(value: DealingDaysTerms[]) {
        if ((!value) || value.length === 0) return;

        const formArr = this.convertDealingDaysToForm(value);
        this.form.controls['monthlyDealingDays'] = formArr;
    }

    get yearlyDealingDays(): DealingDaysTerms[] {
        if (this.tradeCyclePeriod !== E.TradeCyclePeriodEnum.Yearly) return null;

        const arr = this.convertDealingDaysToArr(this.form.controls['yearlyDealingDays'] as FormArray);
        return arr;
    }

    set yearlyDealingDays(value: DealingDaysTerms[]) {
        if ((!value) || value.length === 0) return;

        const formArr = this.convertDealingDaysToForm(value);
        this.form.controls['yearlyDealingDays'] = formArr;
    }

    private getDropdownItemFromValue(dropdowns, value): any {
        if (value == undefined) return null;

        return [_.find(dropdowns, (ditem) => {
            return ditem.id === value;
        })];
    }

    private convertDealingDaysToForm(obj: DealingDaysTerms[]): FormArray {
        const formArr = new FormArray([]);

        _.forEach(obj, (item: DealingDaysTerms) => {
            const termA = [_.find(this.dropdownItems.numberItems, (ditem) => {
                return ditem.id === item.termA;
            })];
            const termB = [_.find(this.dropdownItems.dayItems, (ditem) => {
                return ditem.id === item.termB;
            })];

            let controls;

            if (item.termC !== undefined) {
                const termC = [_.find(this.dropdownItems.monthItems, (ditem) => {
                    return ditem.id === item.termC;
                })];

                controls = {
                    termA: new FormControl(termA),
                    termB: new FormControl(termB),
                    termC: new FormControl(termC),
                };
            } else {
                controls = {
                    termA: new FormControl(termA),
                    termB: new FormControl(termB),
                };
            }

            formArr.push(new FormGroup(controls));
        });

        return formArr;
    }

    private convertDealingDaysToArr(formArr: FormArray): DealingDaysTerms[] {
        const arr = [];

        _.forEach(formArr.controls, (item: FormGroup) => {
            let obj;

            if (item.controls.termC) {
                obj = {
                    termA: item.controls.termA.value[0].id,
                    termB: item.controls.termB.value[0].id,
                    termC: item.controls.termC.value[0].id,
                };
            } else {
                obj = {
                    termA: item.controls.termA.value[0].id,
                    termB: item.controls.termB.value[0].id,
                };
            }

            arr.push(obj);
        });

        return arr;
    }

    addMonthlyDealingDays(): void {
        const group = new FormGroup({
            termA: new FormControl(null, Validators.required),
            termB: new FormControl(null, Validators.required),
        });

        const name = `monthlyDealingDays${(Object.keys(this.form.controls.monthlyDealingDays).length + 1).toString()}`;
        const control = <FormArray>this.form.controls['monthlyDealingDays'];
        control.push(group);
    }

    removeMonthlyDealingDays(index: number): void {
        const control = <FormArray>this.form.controls['monthlyDealingDays'];
        control.removeAt(index);
    }

    addYearlyDealingDays(): void {
        const group = new FormGroup({
            termA: new FormControl(null, Validators.required),
            termB: new FormControl(null, Validators.required),
            termC: new FormControl(null, Validators.required),
        });

        const name = `yearlyDealingDays${(Object.keys(this.form.controls.yearlyDealingDays).length + 1).toString()}`;
        const control = <FormArray>this.form.controls['yearlyDealingDays'];
        control.push(group);
    }

    removeYearlyDealingDays(index: number): void {
        const control = <FormArray>this.form.controls['yearlyDealingDays'];
        control.removeAt(index);
    }

    isValid(): boolean {
        return this.form.disabled || this.form.valid;
    }
}

export class TradeCycleModelDropdowns {
    tradeCyclePeriodItems = [
        { id: E.TradeCyclePeriodEnum.Daily, text: 'Daily' },
        { id: E.TradeCyclePeriodEnum.Weekly, text: 'Weekly' },
        { id: E.TradeCyclePeriodEnum.Monthly, text: 'Monthly' },
        { id: E.TradeCyclePeriodEnum.Yearly, text: 'Yearly' },
    ];
    weeklyItems = [
        { id: E.WeeklyDealingDaysEnum.FirstBusinessDay, text: 'First Business Day' },
        { id: E.WeeklyDealingDaysEnum.LastBusinessDay, text: 'Last Business Day' },
        { id: E.WeeklyDealingDaysEnum.Monday, text: 'Monday' },
        { id: E.WeeklyDealingDaysEnum.Tuesday, text: 'Tuesday' },
        { id: E.WeeklyDealingDaysEnum.Wednesday, text: 'Wednesday' },
        { id: E.WeeklyDealingDaysEnum.Thursday, text: 'Thursday' },
        { id: E.WeeklyDealingDaysEnum.Friday, text: 'Friday' },
    ];
    dayItems = [
        { id: E.WeeklyDealingDaysEnum.FirstBusinessDay, text: 'Calendar day' },
        { id: E.WeeklyDealingDaysEnum.LastBusinessDay, text: 'Business Day' },
        { id: E.WeeklyDealingDaysEnum.Monday, text: 'Monday' },
        { id: E.WeeklyDealingDaysEnum.Tuesday, text: 'Tuesday' },
        { id: E.WeeklyDealingDaysEnum.Wednesday, text: 'Wednesday' },
        { id: E.WeeklyDealingDaysEnum.Thursday, text: 'Thursday' },
        { id: E.WeeklyDealingDaysEnum.Friday, text: 'Friday' },
    ];
    numberItems = [
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
        { id: E.MonthlyDealingDaysEnum.Last, text: 'Last day of Month' },
    ];
    monthItems = [
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
    ];
}

export interface DealingDaysTerms {
    termA: number;
    termB: number;
    termC?: number;
}
