import * as moment from 'moment';

/**
 * moment js add wrapper.
 *
 * @param date
 * @param offset
 * @param merit
 * @return {number}
 */
export function addDay(date: Date, offset: number): number {

    const dataM = moment(date.getTime());
    return dataM.add(offset, 'days').valueOf();
}

/**
 * convert unix timestamp to string
 * @param unixTimeStamp
 * @param formatStr
 * @return {string}
 */
export function unixTimestampToDateStr(unixTimeStamp: number, formatStr: string): string {
    const dataM = moment(unixTimeStamp);
    return dataM.format(formatStr);
}

/**
 * Convert date string to unix timestamp.
 * @param dateStr
 * @param formatStr
 * @return {number}
 */
export function dateStrToUnixTimestamp(dateStr: string, formatStr: string): number {
    const dataM = moment(dateStr, formatStr);
    return dataM.valueOf();
}

/**
 * get current unix timestamp in number.
 * @return {number}
 */
export function getCurrentUnixTimestamp() {
    const dataM = moment();
    return dataM.valueOf();
}

/**
 *  get current timestamp in format of 'format'
 * @param format
 * @return {string}
 */
export function getCurrentUnixTimestampStr(format) {
    const dataM = moment();
    return dataM.format(format);
}
