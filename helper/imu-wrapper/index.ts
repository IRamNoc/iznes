import {fromJS, Map, Seq, List} from 'immutable';

/**
 * Immutable get wrapper.
 *
 * @param data
 * @param path
 * @param defaultValue
 * @return {any|number}
 */
export function get(data: any, path: any, defaultValue: any = ''): any {
    const dataImu = fromJS(data);
    if (typeof path === 'string') {
        const value1 = dataImu.get(path, defaultValue);
        if (value1 !== null && typeof value1.toJS !== 'undefined') {
            return value1.toJS();
        }
        return value1;
    } else if (Array.isArray(path)) {
        const value2 = dataImu.getIn(path, defaultValue);
        if (value2 !== null && typeof value2.toJS !== 'undefined') {
            return value2.toJS();
        }
        return value2;
    }
}

/**
 * Immutable copy
 *
 * @param data
 */
export function copy(data: any): any {
    return fromJS(data).toJS();
}

/**
 * Immutable filter
 *
 * @param data
 * @param filterFun
 */
export function filter(data: any, filterFun: any): any {
    const dataImu = fromJS(data);

    const filtered = dataImu.filter(filterFun);
    return filtered.toJS();
}

/**
 * Immutable reduce
 *
 * @param data
 * @param reduceFun
 * @param initialValue
 */
export function reduce(data: any, reduceFun: any, initialValue): any {
    const dataImu = fromJS(data);

    const reduced = dataImu.reduce(reduceFun, initialValue);
    if (typeof reduced.toJs !== 'undefined') {
        return reduced.toJS();
    }
    return reduced;
}

/**
 * Immutable map
 *
 * @param data
 * @param mapFun
 * @param initialValue
 */
export function map(data: any, mapFun: any): any {
    const dataImu = fromJS(data);

    const maped = dataImu.map(mapFun);

    return maped.toJS();
}

/**
 * Push item to a list and return new list.
 *
 * @param {Array<any>} listJs
 * @param item
 * @return {Array<any>}
 */
export function pushToList(listJs: Array<any>, item: any): Array<any> {
    const list = List(listJs);
    const newList = list.push(item);

    return newList.toJS();
}

/**
 * Remove item with given index.
 *
 * @param {Array<any>} listJs
 * @param {number} index
 * @return {Array<any>}
 */
export function removeFromList(listJs: Array<any>, index: number): Array<any> {
    const list = List(listJs);
    const newList = list.delete(index);

    return newList.toJS();
}

/**
 * Update in list for the give pass, and update callback
 * the callback is used to update the value.
 *
 * @param {Array<any>} listJs
 * @param {Array<string>} keyPath
 * @param updater
 * @return {Array<any>}
 */
export function updateInList(listJs: Array<any>, keyPath: Array<string>, updater: any): Array<any> {
    const list = List(listJs);
    const newList = list.updateIn(keyPath, updater);

    return newList.toJS();
}


/**
 * Deep from js to immutable.
 *
 * @param js
 * @return {List<V>|Map<K, V>}
 */
function fromJSGreedy(js) {
    return typeof js !== 'object' || js === null ? js :
        Array.isArray(js) ?
            Seq(js).map(fromJSGreedy).toList() :
            Seq(js).map(fromJSGreedy).toMap();
}

