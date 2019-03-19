import { SearchFilters } from '../search-filters';
import { FormBuilder, FormGroup } from '@angular/forms';
import { of, Observable, Subject } from 'rxjs';

describe('SearchFilters:', () => {
    let fixture: SearchFilters;
    const filterStoreFactory = obs => ({ getFilters: _ => obs });
    const obsFixtureFactory = (obs: Observable<any>): SearchFilters => {
        return new SearchFilters(new FormBuilder(), filterStoreFactory(obs));
    };
    const fixtureFactory = (filters = {}): SearchFilters => {
        return obsFixtureFactory(of(filters));
    };
    beforeEach(() => {
        fixture = fixtureFactory();
    });
    it('Can be instantiated', () => {
        expect(fixture instanceof SearchFilters).toBeTruthy();
    });
    it('Can create the filter form', () => {
        const form = fixture.getForm();

        expect(form instanceof FormGroup).toBeTruthy();
        expect(Object.keys(form.controls).length).toBe(12);
    });
    it('Returns the same form instance on subsequent gets', () => {
        const form = fixture.getForm();

        form.patchValue({ orderID: 'x' });

        const form2 = fixture.getForm();

        expect(form2.get('orderID').value).toBe('x');
    });
    it('Has the correct default values', () => {
        const form = fixture.getForm();

        expect(form.get('orderID').value).toBe(null);
        expect(form.get('fundname').value).toBe(null);
        expect(form.get('sharename').value).toBe(null);
        expect(form.get('isin').value).toBe(null);
        expect(form.get('fromDate').value).toBe(null);
        expect(form.get('toDate').value).toBe(null);
        expect(form.get('status').value).toEqual([{ id: -3, text: 'All' }]);
        expect(form.get('type').value).toEqual([{ id: 0, text: 'All' }]);
        expect(form.get('dateType').value).toEqual([{ id: 'navDate', text: 'NAV Date' }]);
    });
    it('Resets back to default values', () => {
        const form = fixture.getForm();

        form.patchValue({
            orderID: 'x',
            fundname: 'x',
            sharename: 'x',
            isin: 'x',
            fromDate: 'x',
            toDate: 'x',
            status: 'x',
            type: 'x',
            dateType: 'x',
        });

        fixture.clear();

        expect(form.get('orderID').value).toBe(null);
        expect(form.get('fundname').value).toBe(null);
        expect(form.get('sharename').value).toBe(null);
        expect(form.get('isin').value).toBe(null);
        expect(form.get('fromDate').value).toBe(null);
        expect(form.get('toDate').value).toBe(null);
        expect(form.get('status').value).toEqual([{ id: -3, text: 'All' }]);
        expect(form.get('type').value).toEqual([{ id: 0, text: 'All' }]);
        expect(form.get('dateType').value).toEqual([{ id: 'navDate', text: 'NAV Date' }]);
    });
    describe('Applying filters from redux:', () => {
        let subj;
        beforeEach(() => {
            subj = new Subject<any>();
        });
        it('orderID', () => {
            const form = obsFixtureFactory(subj.asObservable()).getForm();
            expect(form.get('orderID').value).not.toBe(99);

            subj.next({ orderID: 99 });

            setTimeout(() => {
                expect(expect(form.get('orderID').value).toBe(99));
            }, 1000)
        });
        it('orderID as string', () => {
            const form = obsFixtureFactory(subj.asObservable()).getForm();
            expect(form.get('orderID').value).not.toBe('99');

            subj.next({ orderID: '99' });

            setTimeout(() => {
                expect(expect(form.get('orderID').value).toBe('99'));
            }, 1000)
        });
        it('isin', () => {
            const form = obsFixtureFactory(subj.asObservable()).getForm();
            expect(form.get('isin').value).not.toBe('IS001');

            subj.next({ isin: 'IS001' });

            setTimeout(() => {
                expect(expect(form.get('isin').value).toBe('IS001'));
            }, 1000)
        });
        it('sharename', () => {
            const form = obsFixtureFactory(subj.asObservable()).getForm();
            expect(form.get('sharename').value).not.toBe('share1');

            subj.next({ sharename: 'share1' });

            setTimeout(() => {
                expect(expect(form.get('sharename').value).toBe('share1'));
            }, 1000)
        });
        it('fundname', () => {
            const form = obsFixtureFactory(subj.asObservable()).getForm();
            expect(form.get('fundname').value).not.toBe('fund1');

            subj.next({ fundname: 'fund1' });

            setTimeout(() => {
                expect(expect(form.get('fundname').value).toBe('fund1'));
            }, 1000)
        });
        it('fromDate', () => {
            const form = obsFixtureFactory(subj.asObservable()).getForm();
            expect(form.get('fromDate').value).not.toBe('2018-01-01');

            subj.next({ fromDate: '2018-01-01' });

            setTimeout(() => {
                expect(expect(form.get('fromDate').value).toBe('2018-01-01'));
            }, 1000)
        });
        it('toDate', () => {
            const form = obsFixtureFactory(subj.asObservable()).getForm();
            expect(form.get('toDate').value).not.toBe('2018-01-02');

            subj.next({ toDate: '2018-01-02' });

            setTimeout(() => {
                expect(expect(form.get('toDate').value).toBe('2018-01-02'));
            }, 1000)
        });
        it('status', () => {
            const form = obsFixtureFactory(subj.asObservable()).getForm();
            expect(form.get('status').value).not.toBe([{ id: 4, text: 'Unpaid' }]);

            subj.next({ status: [{ id: 4 }] });

            setTimeout(() => {
                expect(expect(form.get('status').value).toEqual([{ id: 4, text: 'Unpaid' }]));
            }, 1000)
        });
        it('type', () => {
            const form = obsFixtureFactory(subj.asObservable()).getForm();
            expect(form.get('type').value).not.toBe([{ id: 4, text: 'Redemption' }]);

            subj.next({ type: [{ id: 4 }] });

            setTimeout(() => {
                expect(expect(form.get('type').value).toEqual([{ id: 4, text: 'Redemption' }]));
            }, 1000)
        });
        it('dateType', () => {
            const form = obsFixtureFactory(subj.asObservable()).getForm();
            expect(form.get('dateType').value).not.toBe([{ id: 'orderDate', text: 'Order Date' }]);

            subj.next({ dateType: [{ id: 'orderDate' }] });

            setTimeout(() => {
                expect(expect(form.get('dateType').value).toEqual([{ id: 'orderDate', text: 'Order Date' }]));
            }, 1000)
        });
    });
    it('Emits optionalFilters false when __NO__ optional filter is set', (done: DoneFn) => {
        fixture = fixtureFactory({ isin: 'IS001' });
        fixture.getForm();
        fixture.apply();

        fixture.optionalFilters.subscribe((show) => {
            expect(show).toBeFalsy();
            done();
        });
    });
    it('Emits optionalFilters true when an optional filter is set', (done: DoneFn) => {
        fixture = fixtureFactory({ fromDate: '2018-01-01' });
        fixture.getForm();
        fixture.apply();

        fixture.optionalFilters.subscribe((show) => {
            expect(show).toBeTruthy();
            done();
        });
    });
    it('Emits filtersApplied when a filter has been supplied', (done: DoneFn) => {
        fixture = fixtureFactory({ isin: 'x' });
        fixture.getForm();

        fixture.filtersApplied.subscribe((show) => {
            expect(true).toBeTruthy();
            done();
        });

        fixture.apply();
    });
    it('Detects when filters have changed', () => {
        const form = fixture.getForm();

        form.patchValue({ isin: 'NEW' });

        expect(fixture.haveChanged()).toBeTruthy();
    });
    it('Detects when filters are different from default', () => {
        const form = fixture.getForm();

        form.patchValue({ isin: 'NEW' });
        form.patchValue({ isin: null });

        expect(fixture.haveChanged()).toBeFalsy();
    });
    it('Returns the filters from the form', () => {
        const form = fixture.getForm();

        form.patchValue({ isin: 'NEW' });

        expect(fixture.get().isin).toBe('NEW');
    });
    it('Returns an empty object when filters have not changed', () => {
        const form = fixture.getForm();

        form.patchValue({ isin: 'NEW' });
        form.patchValue({ isin: null });

        expect(fixture.get()).toEqual({});
    });
});
