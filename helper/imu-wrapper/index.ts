import {fromJS, Map, Seq} from 'immutable';

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

