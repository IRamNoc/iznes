import { ClrDatagridStringFilterInterface } from '@clr/angular';

/**
 * DataGrid Number Filter
 */
export class DataGridNumberFilter implements ClrDatagridStringFilterInterface<any> {
    public numberField: string = '';
    public filterType: string = 'DataGridNumberFilter';

    /**
     * Constructor
     *
     * @param {string} idField - Field that will contain a unique ID.
     * @param {string} numberField - Field that contains a human readable label.
     */
    constructor(numberField: string) {
        this.numberField = numberField;
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
        if (!item[this.numberField] && item[this.numberField] !== 0) return false;
        return item[this.numberField].toString().replace(/,/g, '') === search.replace(/,/g, '');
    }
}
