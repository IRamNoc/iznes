/**
 * Datagrid List Action Model
 */
export class DatagridListActionModel {
    public id: {} = { text: '', data: '' };
    public class: string = 'btn btn-sm';
    public icon: string = 'fa-search';
    public label:string = 'Action';
    public isVisible:any = () => { return true; };
    public record: any = {};
    public onClick:any = () => {};

    /**
     * Constructor
     *
     * @param {any} options Options Object
     */
    public constructor(options: any) {
        this.setOptions(options);
    }

    /**
     * Set Options
     *
     * @param {any} options Options Object
     *
     * @returns {void}
     */
    public setOptions(options: any) {
        for (const prop in options) {
            if (options.hasOwnProperty(prop) && this.hasOwnProperty(prop)) {
                this[prop] = options[prop];
            }
        }
    }
}
