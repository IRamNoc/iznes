import * as moment from 'moment-timezone';

/**
 * moment js add wrapper.
 *
 * @param date
 * @param offset
 * @return {number}
 */
export function addDay(date: Date, offset: number): number {

    const dataM = moment(date.getTime());
    return dataM.add(offset, 'days').valueOf();
}

/**
 * moment js add wrapper.
 *
 * @param date
 * @param offset
 * @return {number}
 */
export function substractYear(date: Date, offset: number): number {

    const dataM = moment(date.getTime());
    return dataM.subtract(offset, 'years').valueOf();
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

/**
 *  convert utc date time to local date time.
 * @param format
 * @return {string}
 */
export function convertToLocal(date: Date, formatStr: string) {
    return moment.utc(date).local().format(formatStr);
}

/**
 *  convert utc date time string to local date time.
 * @param dateTimeStr
 * @param format
 * @param outFormat
 * @return {string}
 */
export function convertUtcStrToLocalStr(dateTimeStr: string, formatStr: string, outFormat: string = null) {
    return moment.utc(dateTimeStr, formatStr).local().format((outFormat || formatStr));
}

/**
 * Get a list of timezone moment support, in ng2-select format
 * @return {Array<{id: string, text: string}>}
 */
export function getMomentTimeZoneNameList() {
    const nameList = [];

    moment.tz.names().map((name) => {
        nameList.push({ id: name, text: name });
    });

    return nameList;
}
