import { isDate } from 'rxjs/internal/util/isDate';
import { ClrDatagridStringFilterInterface } from '@clr/angular';
import * as moment from 'moment';

/**
 * DataGrid String Filter
 */
export class DataGridDateRangeFilter implements ClrDatagridStringFilterInterface<any> {
    public dateField: string;
    public fromField: string;
    public toField: string;
    public includes: boolean;
    public filterType: string = 'DataGridDateRangeFilter';
    /**
     * Constructor
     *
     * @param {string} params - Date Field to filter, Date Range From Field, Date Range To Field, Date Range To Includes
     */

    constructor(params) {

        this.dateField = params.dateField;
        this.fromField = (params.fromField ? params.fromField : '');
        this.toField = (params.toField ? params.toField : '');
        this.includes = !!params.includes;

        if (this.fromField === '' || this.fromField === this.dateField) {
            this.fromField = `${this.dateField}_from`;
        }
        if (this.toField === '' || this.fromField === this.dateField) {
            this.toField = `${this.dateField}_to`;
        }
    }
    /**
     * Accepts
     *
     * @param {any} item - Item to be tested.
     * @param {string} search - Search Term to test item with.
     *
     * @returns {boolean}
     */
    accepts(item: any, search: string): boolean {
        /* Break down the search string into our dates. */
        const itemDate = item[this.dateField];

        if (!itemDate) return false;

        const fromDateRaw = search.substring(0, search.indexOf('<>'));
        const fromDate: any = new Date(fromDateRaw).getDate() ? fromDateRaw : undefined;

        const toDateRaw = search.substring(search.indexOf('<>') + 2, search.length);
        let toDate: any = new Date(toDateRaw).getDate() ? toDateRaw : undefined;

        /* If we're including the last day, we'll set the time. */
        if (toDate && this.includes) {
            toDate = moment(toDate).format('YYYY-MM-DD 23:59:59');
        }

        /* Do date checks. */
        const fromDateIsBefore = fromDate ? moment(itemDate).isSameOrAfter(moment(fromDate)) : false;
        const toDateIsAfter = toDate ? moment(itemDate).isSameOrBefore(moment(toDate)) : false;

        /* If we do have a fromDate and don't have a toDate... */
        if (fromDate && !toDate) return fromDateIsBefore;

        /* If we don't have a fromDate and do have a toDate... */
        if (!fromDate && toDate) return toDateIsAfter;

        /* If we have both... */
        if (fromDate && toDate) return fromDateIsBefore && toDateIsAfter;

        /* Else we have none. */
        return true;
    }
}
