import { Observable } from 'rxjs';

export interface PanelAction {
    title: string;
    icon: string;
    callback: () => void;
}

export interface SubpanelColumn {
    label: string;
    dataSource: string;
    sortable: boolean;
    link?: string;
}

export interface Subpanel {
    title: string;
    action?: PanelAction;
    columns: SubpanelColumn[];
    open: boolean;
    data: Observable<Share[] | Fund[] | UmbrellaFund[] | Awaiting[]>;
}

export interface Share {
    id: number;
    name: string;
    fund: string;
    isin: string;
    managementCompany: string;
    type: string;
    status: boolean;
    nav: number;
    units: number;
    umbrellaFund: string;
    aum: string;
    date: string;
    currency: string;
    legalForm: string;
}

export interface Fund {
    id: number;
    name: string;
    lei: string;
    managementCompany: string;
    country: string;
    lowStatus: string;
    umbrellaFund: string;
    currency: string;
}

export interface UmbrellaFund {
    id: number;
    name: string;
    lei: string;
    managementCompany: string;
    country: string;
    currency: string;
}

export interface Awaiting {
    id: number;
    status: string;
    type: string;
    name: string;
    date: string;
    validationDate: string;
    modifiedBy: string;
}
