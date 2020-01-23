import * as _ from 'lodash';
import * as moment from 'moment';

export class DatePickerExtendedHelper {
    static addWeekendsToArray(arr: moment.Moment[],
                              startRaw: moment.Moment,
                              end: moment.Moment): moment.Moment[] {
        const result: moment.Moment[] = [];
        const start: moment.Moment = startRaw.clone();

        if (start.isoWeekday() !== 6) start.day(6);

        while (start.day(6).isBefore(end)) {
            result.push(start.clone());
            result.push(start.add(1, 'day').clone());
        }

        arr = arr.concat(result);

        _.uniqBy(arr, (e: moment.Moment) => {
            return e.toISOString();
        });

        _.orderBy(arr, (e: moment.Moment) => {
            return e.toDate();
        });

        return arr;
    }

    static removeWeekendsFromArray(arr: moment.Moment[]): moment.Moment[] {
        arr = _.filter(arr, (e: moment.Moment) => {
            return e.isoWeekday() < 6;
        });

        return arr;
    }

    static convertStringDatesToMoment(dates: string[]): moment.Moment[] {
        const arr: moment.Moment[] = [];

        _.forEach(dates, (e: string) => {
            arr.push(moment(e));
        });

        return arr;
    }
}
