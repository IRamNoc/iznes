import { Injectable, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { get, isUndefined, isEmpty, find, isNumber, isEqual } from 'lodash';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { orderStatuses, orderTypes, dateTypes } from './lists';
import { ManageOrdersService } from './manage-orders.service';

interface SelectedItem {
    id: any;
    text: number | string;
}

export abstract class ISearchFilters {
    abstract getForm(): FormGroup;
    abstract get(): any;
}

export abstract class IFilterStore {
    abstract getFilters(): Observable<object>;
}

@Injectable()
export class SearchFilters implements ISearchFilters {

    private defaultForm = {
        orderID: null,
        fundname: null,
        sharename: null,
        isin: null,
        status: [orderStatuses[0]],
        type: [orderTypes[0]],
        dateType: [dateTypes[2]],
        fromDate: null,
        toDate: null,
    };

    private form: FormGroup;
    private filterStore: object;
    private optionalFiltersValue = false;
    private optionalFiltersSubject = new BehaviorSubject<boolean>(false);
    private filtersAppliedSubject = new Subject<void>();

    constructor(private formBuilder: FormBuilder, filterStore: IFilterStore) {
        this.getForm();
        filterStore.getFilters().subscribe((store) => {
            this.filterStore = store;
            this.apply();
        });
    }

    getForm(): FormGroup {
        if (!this.form) {
            const formSchema = Object.keys(this.defaultForm)
                .reduce(
                    (a, k) => {
                        a[k] = [this.defaultForm[k]];
                        return a;
                    },
                    {},
                );
            this.form = this.formBuilder.group(formSchema);
        }

        return this.form;
    }

    get() {
        if (isEqual(this.form.value, this.defaultForm)) {
            return {};
        }
        return this.form.value;
    }

    clear(): void {
        this.form.patchValue(this.defaultForm);
    }

    apply() {
        if (this.anyNotUndefined(this.filterStore, Object.keys(this.defaultForm))) {
            this.setSearchFormFilter('isin');
            this.setSearchFormFilter('sharename');
            this.setSearchFormFilter('fundname');

            this.setChoiceFormFilter('status', orderStatuses);
            this.setChoiceFormFilter('type', orderTypes);
            this.setChoiceFormFilter('dateType', dateTypes);

            this.optionalFiltersValue = !!get(this.filterStore, ['dateType', 'length'], false);
            this.setOptionalFormFilter('fromDate');
            this.setOptionalFormFilter('toDate');
            this.setOptionalFormFilter('orderID', get(this.filterStore, 'orderID'));
            this.optionalFiltersSubject.next(this.optionalFiltersValue);

            // this.filtersAppliedSubject.next();
        } else {
            this.form.patchValue(this.defaultForm, { emitEvent: false });
        }
        this.filtersAppliedSubject.next();
    }

    haveChanged(): boolean {
        return !isEqual(this.form.value, this.defaultForm);
    }

    get optionalFilters(): Observable<boolean> {
        return this.optionalFiltersSubject.asObservable();
    }

    get filtersApplied(): Observable<void> {
        return this.filtersAppliedSubject.asObservable();
    }

    private anyNotUndefined(object: object, props: string[]): boolean {
        for (let i = 0; i < props.length; i += 1) {
            if (!isUndefined(get(object, props[i]))) {
                return true;
            }
        }
        return false;
    }

    private filterInStore(prop: string): boolean {
        const value = get(this.filterStore, prop, '');
        return !isEmpty(value) || (isNumber(value) && value > 0);
    }

    private setSearchFormFilter(prop: string, value?: any): void {
        if (this.filterInStore(prop)) {
            this.setSearchFormValue(prop, value);
        }
    }

    private setOptionalFormFilter(prop: string, value?: any): void {
        if (this.filterInStore(prop)) {
            this.setSearchFormValue(prop, value);
            this.optionalFiltersValue = true;
        }
    }

    private setChoiceFormFilter(prop: string, choices: SelectedItem[]) {
        if (this.filterInStore(prop)) {
            const id = get(this.filterStore, [prop, '0', 'id']);

            this.findCb(choices, ['id', id], (result) => {
                this.setSearchFormValue(prop, [result]);
            });
        } else {
            this.setSearchFormValue(prop, []);
        }
    }

    private setSearchFormValue(prop: string, value?: any): void {
        this.form.get(prop).patchValue(value || this.filterStore[prop], { emitEvent: false });
    }

    private findCb(haystack, needle, cb) {
        const result = find(haystack, needle);
        if (result) {
            cb.call(null, result);
        }
    }
}
