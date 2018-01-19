export class Contract {
    public updated: boolean = false;
    public creation: number = null;
    public hash: string = null;
    public fromaddr: string = null;
    public txtype: number = null;
    public basechain: number = null;
    public type_name: string = null;
    public amount: number = null;
    public toaddr: string = null;
    public tochain: number = null;
    public blockheight: number = null;
    public contractdata: object = null;

    public constructor() {

    }

    /**
     * From JSON method
     *
     * @param json
     *
     * @returns {Contract}
     */
    public static fromJSON(json) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        let contract = new Contract();
        for (let prop in json) {
            if (contract.hasOwnProperty(prop)) {
                contract[prop] = json[prop];
            }
        }
        return contract;
    }

    /**
     * To JSON method
     *
     * @returns {string}
     */
    public toJSON() {
        let json = {};
        for (let prop in this) {
            if (typeof prop !== 'function') {
                (json as any)[prop] = this[prop];
                console.log(prop);
            }
        }
        return json;
    }
}
