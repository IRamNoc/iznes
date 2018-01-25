export abstract class JsonDataService {
    /**
     * From JSON method
     *
     * @param json   JSON string
     * @param object Object to be filled
     *
     * @returns {any}
     */
    public fromJSON(json, object) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        for (const prop in json) {
            if (object.hasOwnProperty(prop)) {
                object[prop] = json[prop];
            }
        }
        return object;
    }

    /**
     * To JSON method
     *
     * @param object Object
     *
     * @returns {string}
     */
    public toJSON(object) {
        return JSON.stringify(object);
    }
}