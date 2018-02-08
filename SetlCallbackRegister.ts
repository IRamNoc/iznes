import * as _ from 'lodash';

export class SetlCallbackRegister {
    callbackCache: any;
    uniqueID: any;
    maxReservedID: any;

    constructor() {
        this.callbackCache = {};
        this.maxReservedID = 999;

        this.uniqueID = this.maxReservedID + 1; // Initial value.
    }

    get uniqueIDValue() {
        return this.uniqueID++;
    }

    addHandler(id, callback, userData) {
        try {
            if (!(_.isNumber(id))) {
                id = id.toUpperCase();
            }

            this.callbackCache[id] = _.get(this.callbackCache, [id], []);

            if (callback) {
                this.callbackCache[id].push({ID: id, Callback: callback, userData: userData});
            }

            return id;
        }
        catch (e) {
            console.log(e);
        }

        return -1;
    }

    removeHandler(id, callBack) {
        let rVal = 0;

        try {
            if (!(_.isNumber(id))) {
                id = id.toUpperCase();
            }

            if (this.callbackCache[id]) {
                let thisCallbackObject;

                for (let index = 0; index < this.callbackCache[id].length; ++index) {
                    try {
                        thisCallbackObject = this.callbackCache[id][index];

                        if (thisCallbackObject.Callback === callBack) {
                            delete this.callbackCache[id][index];
                            rVal++;
                        }
                    } catch (e) {
                        rVal = -1;
                    }
                }
            }
        } catch (e) {
            rVal = -1;
        }

        return rVal;
    }

    removeAllHandlers(id) {
        let rVal = 0;

        try {
            if (!(_.isNumber(id))) {
                id = id.toUpperCase();
            }

            if (this.callbackCache[id]) {
                delete this.callbackCache[id];
                rVal++;
            }
        } catch (e) {
            rVal = -1;
        }

        return rVal;
    }

    handleEvent(id, eventData) {
        /**
         * Call functions associated withe this id, calls functions associated with id == 0 if no other callback
         * set. Callbacks are deleted when handled, except for id = 0;
         */

        if (!(_.isNumber(id))) {
            id = id.toUpperCase();
        }

        let rVal = 0;
        const thisID = id;

        if (this.callbackCache[id]) {
            let thisCallbackObject;

            for (let index = 0; index < this.callbackCache[id].length; ++index) {
                try {
                    if (index in this.callbackCache[id]) {
                        thisCallbackObject = this.callbackCache[id][index];

                        if ((thisCallbackObject) && (thisCallbackObject.Callback)) {
                            thisCallbackObject.Callback(thisCallbackObject.ID, eventData, thisCallbackObject.UserData);
                            rVal++;
                        }
                    }
                } catch (e) {

                }
            }

            try {
                // Don't delete if it is a number and <= this.maxReservedID
                if (thisID && (_.isNumber(thisID)) && (thisID > this.maxReservedID)) {
                    this.callbackCache[id] = [];
                    delete this.callbackCache[id];
                }
            } catch (e) {

            }
        }

        return rVal;
    }
}

