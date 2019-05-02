import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'datex' })
export class DateXPipe implements PipeTransform {
    transform(date: string, format): string {
        return moment(date).format(format);
    }
}
