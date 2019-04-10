/**
 * Datagrid List Field Model
 */
export class DatagridListFieldModel {
    public label: string = null;
    public type: 'text'|'number'|'currency'|'percentage'|'date'|'label'|'icon' = 'text';
    public options: {} = {};
    public name: string = null;
    public hidden: any = null;
    public filter: string = null;

    /**
     * Constructor
     *
     * @param {any} options Options Object
     */
    constructor(options: any) {
        this.setOptions(options);
    }

    /**
     * Set Options
     *
     * @param {any} options Options Object
     *
     * @return {void}
     */
    private setOptions(options: any) {
        for (const prop in options) {
            if (options.hasOwnProperty(prop) && this.hasOwnProperty(prop)) {
                this[prop] = options[prop];
            }
        }
    }
}
