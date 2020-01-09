import { ClrDatagridStringFilterInterface } from '@clr/angular';

/**
 * DataGrid String Filter
 */
export class DataGridStringFilter implements ClrDatagridStringFilterInterface<any> {
    public stringField: string = '';
    public filterType: string = 'DataGridStringFilter';

    /**
     * Constructor
     *
     * @param {string} idField - Field that will contain a unique ID.
     * @param {string} stringField - Field that contains a human readable label.
     */
    constructor(stringField: string) {
        this.stringField = stringField;
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
        if (!item[this.stringField]) return false;
        return item[this.stringField].toString().toLowerCase().indexOf(search) >= 0;
    }
}
