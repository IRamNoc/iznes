import { ClrDatagridStringFilterInterface } from '@clr/angular';

/**
 * DataGrid String Filter
 */
export class DataGridMappedValueFilter implements ClrDatagridStringFilterInterface<any> {
    public stringField: string = '';
    public valueMap: {} = {};
    public filterType: string = 'DataGridStringFilter';

    /**
     * Constructor
     *
     * @param {string} idField - Field that will contain a unique ID.
     * @param {string} stringField - Field that contains a human readable label.
     */
    constructor(stringField: string, map: {}) {
        this.stringField = stringField;
        this.valueMap = map;
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
        if (!item[this.stringField] && item[this.stringField] !== 0) return false;
        const mappedValue = (this.valueMap[item[this.stringField]] || {}).text;
        return mappedValue ? mappedValue.toString().toLowerCase().indexOf(search) >= 0 : false;
    }
}
