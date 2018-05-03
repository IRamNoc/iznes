import {Inject, Injectable} from '@angular/core';
import * as moment from 'moment';

import * as NavEnum from './NavEnum';

@Injectable()
export class NavHelperService {

    constructor() { }

    static getNextValuationDate(valuationFrequency: number, navDate: string): string {
        let nextValuationDate;
        const date = moment(navDate);
    
        switch (valuationFrequency) {
            case NavEnum.ValuationFrequencyEnum.Daily:
                nextValuationDate = date.add(1, 'days');
                break;
            case NavEnum.ValuationFrequencyEnum.TwiceAWeek:
                nextValuationDate = date.add(1, 'days');
                break;
            case NavEnum.ValuationFrequencyEnum.Weekly:
                nextValuationDate = date.add(1, 'weeks');
                break;    
            case NavEnum.ValuationFrequencyEnum.TwiceAMonth:
                nextValuationDate = date.add(1, 'days');
                break;
            case NavEnum.ValuationFrequencyEnum.Monthly:
                nextValuationDate = date.add(1, 'months');
                break;
            case NavEnum.ValuationFrequencyEnum.Quarterly:
                nextValuationDate = date.add(12, 'weeks');
                break;
            case NavEnum.ValuationFrequencyEnum.TwiceAYear:
                nextValuationDate = date.add(26, 'weeks');
                break;
            case NavEnum.ValuationFrequencyEnum.Annually:
                nextValuationDate = date.add(1, 'years');
                break;
            case NavEnum.ValuationFrequencyEnum.AtLeastAnnualy:
                nextValuationDate = date.add(1, 'years');
                break;
            case NavEnum.ValuationFrequencyEnum.Other:
                nextValuationDate = date.add(1, 'days');
                break;
            default:
                nextValuationDate = date.add(1, 'days');
        }
    
        return nextValuationDate.format('YYYY-MM-DD');
    }

}