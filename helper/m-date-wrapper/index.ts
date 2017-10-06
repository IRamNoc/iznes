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
