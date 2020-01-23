import { ClrDatagridStringFilterInterface } from '@clr/angular';

/**
 * DataGrid Dropdown Filter
 */
export class DataGridDropdownFilter implements ClrDatagridStringFilterInterface<any> {
    public idField: string = '';
    public filterType: string = 'DataGridDropdownFilter';

    /**
     * Constructor
     *
     * @param {string} idField - Field that will contain a unique ID.
     */
    constructor(idField: string) {
        this.idField = idField;
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
        if (item[this.idField] === null || item[this.idField] === undefined) {
            return false;
        }
        const searchArray = search.toString().toLowerCase().split('||');
        for (const index in searchArray) {
            if (item[this.idField].toString().toLowerCase() === searchArray[index]) {
                return true;
            }
        }
        return false;
    }
}
