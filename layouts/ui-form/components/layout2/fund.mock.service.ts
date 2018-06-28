import {Injectable} from '@angular/core';
import {Share, Fund, UmbrellaFund, Awaiting} from './models';
import {Observable} from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class MockFundService {

    getShares(): Observable<Share[]> {
        return new Observable((observer) => {
            observer.next([
                {
                    id: 1,
                    name: 'Ofi Share A1',
                    fund: 'OFI Fund A',
                    isin: '1234567890',
                    managementCompany: 'OFI',
                    type: 'A',
                    status: true,
                    nav: 1,
                    aum: 'aum',
                    units: 10000,
                    umbrellaFund: 'Umbrella Fund Tektonic',
                    date: '21/01/2018',
                    currency: '$',
                    legalForm: 'legalForm',
                },
                {
                    id: 2,
                    name: 'Ofi Share A1',
                    fund: 'OFI Fund A',
                    isin: '1234567890',
                    managementCompany: 'OFI',
                    type: 'B',
                    status: true,
                    nav: 1,
                    aum: 'aum',
                    units: 10000,
                    umbrellaFund: 'Umbrella Fund Tektonic',
                    date: '21/01/2018',
                    currency: '£',
                    legalForm: 'Legal form 2',
                },
                {
                    id: 3,
                    name: 'Ofi Share A1',
                    fund: 'OFI Fund A',
                    isin: '1234567890',
                    managementCompany: 'OFI',
                    type: 'C',
                    status: false,
                    nav: 1,
                    aum: '',
                    units: 10000,
                    umbrellaFund: 'Umbrella Fund Tektonic',
                    date: '21/01/2018',
                    currency: '€',
                    legalForm: 'Legal 3',
                },
                {
                    id: 4,
                    name: 'Ofi Share A1',
                    fund: 'OFI Fund A',
                    isin: '1234567890',
                    managementCompany: 'OFI',
                    type: 'C',
                    status: false,
                    nav: 1,
                    aum: '',
                    units: 10000,
                    umbrellaFund: 'Umbrella Fund Tektonic',
                    date: '21/01/2018',
                    currency: '€',
                    legalForm: 'Legal 3',
                },
                {
                    id: 5,
                    name: 'Ofi Share A1',
                    fund: 'OFI Fund A',
                    isin: '1234567890',
                    managementCompany: 'OFI',
                    type: 'C',
                    status: false,
                    nav: 1,
                    aum: '',
                    units: 10000,
                    umbrellaFund: 'Umbrella Fund Tektonic',
                    date: '21/01/2018',
                    currency: '€',
                    legalForm: 'Legal 3',
                },
            ]);
        });
    }

    getFunds(): Observable<Fund[]> {
        return new Observable((observer) => {
            return observer.next([
                {
                    id: 1,
                    name: 'OFI Fund A',
                    lei: '1234567890',
                    managementCompany: 'OFI',
                    country: 'France',
                    lowStatus: 'SICAC',
                    umbrellaFund: 'Umbrella Fund OFI Worldwide',
                    currency: '$',
                },
                {
                    id: 2,
                    name: 'OFI Fund A',
                    lei: '1234567890',
                    managementCompany: 'OFI',
                    country: 'France',
                    lowStatus: 'SICAC',
                    umbrellaFund: 'Umbrella Fund OFI Worldwide',
                    currency: '€',
                },
                {
                    id: 3,
                    name: 'OFI Fund A',
                    lei: '1234567890',
                    managementCompany: 'OFI',
                    country: 'France',
                    lowStatus: 'SICAC',
                    umbrellaFund: 'Umbrella Fund OFI Worldwide',
                    currency: '$',
                },
            ]);
        });
    }

    getUmbrellaFunds(): Observable<UmbrellaFund[]> {
        return new Observable((observer) => {
            return observer.next([
                {
                    id: 1,
                    name: 'Umbrella Fund Tektonic',
                    lei: '1234567890',
                    managementCompany: 'OFI France',
                    country: 'France',
                    currency: '$',
                },
                {
                    id: 2,
                    name: 'Umbrella Fund Tektonic',
                    lei: '1234567890',
                    managementCompany: 'OFI France',
                    country: 'France',
                    currency: '€',
                },
            ]);
        });
    }

    getAwaitings(): Observable<Awaiting[]> {
        return new Observable((observer) => {
            observer.next([
                {
                    id: 1,
                    status: 'To validate',
                    type: 'Share',
                    name: 'Share OfiSh6',
                    date: '2018-01-02',
                    validationDate: '2017-11-26',
                    modifiedBy: 'Jean Remplisseur (OFI)',
                },
                {
                    id: 2,
                    status: 'To validate',
                    type: 'Fund',
                    name: 'Fund Ofi4',
                    date: '2018-01-02',
                    validationDate: '2017-11-26',
                    modifiedBy: 'Jean Remplisseur (OFI)',
                },
                {
                    id: 3,
                    status: 'To validate',
                    type: 'Umbrella Fund',
                    name: 'Umbrella U3',
                    date: '2018-01-02',
                    validationDate: '2017-11-26',
                    modifiedBy: 'Jean Remplisseur (OFI)',
                },
            ]);
        });
    }

    getShare(id: number): Observable<Share> {
        return this.getShares().pipe(
            switchMap((shares) => {
                return new Observable((observer) => {
                    observer.next(shares.find(item => item.id === id));
                });
            })
        );
    }

    getFund(id: number): Observable<Fund> {
        return this.getFunds().pipe(
            switchMap((funds) => {
                return new Observable((observer) => {
                    observer.next(funds.find(item => item.id === id));
                });
            })
        );
    }

    getAwaiting(id: number): Observable<Awaiting> {
        return this.getAwaitings().pipe(
            switchMap((awaitings) => {
                return new Observable((observer) => {
                    observer.next(awaitings.find(item => item.id === id));
                });
            })
        );
    }

    getUmbrellaFund(id: number): Observable<UmbrellaFund> {
        return this.getUmbrellaFunds().pipe(
            switchMap((umbrellaFunds) => {
                return new Observable((observer) => {
                    observer.next(umbrellaFunds.find(item => item.id === id));
                });
            })
        );
    }
}
