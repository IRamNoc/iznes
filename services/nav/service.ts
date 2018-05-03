import {Inject, Injectable} from '@angular/core';
import * as moment from 'moment';

import * as FundShareEnum from '../../../ofi-main/ofi-product/fund-share/FundShareEnum';

@Injectable()
export class NavHelperService {

    constructor() { }

    static getNextValuationDate(valuationFrequency: number, navDate: string): string {
        let nextValuationDate;
        const date = moment(navDate);
    
        switch (valuationFrequency) {
            case FundShareEnum.ValuationFrequencyEnum.Daily:
                nextValuationDate = date.add(1, 'days');
                break;
            case FundShareEnum.ValuationFrequencyEnum.TwiceAWeek:
                nextValuationDate = date.add(1, 'days');
                break;
            case FundShareEnum.ValuationFrequencyEnum.Weekly:
                nextValuationDate = date.add(1, 'weeks');
                break;    
            case FundShareEnum.ValuationFrequencyEnum.TwiceAMonth:
                nextValuationDate = date.add(1, 'days');
                break;
            case FundShareEnum.ValuationFrequencyEnum.Monthly:
                nextValuationDate = date.add(1, 'months');
                break;
            case FundShareEnum.ValuationFrequencyEnum.Quarterly:
                nextValuationDate = date.add(12, 'weeks');
                break;
            case FundShareEnum.ValuationFrequencyEnum.TwiceAYear:
                nextValuationDate = date.add(26, 'weeks');
                break;
            case FundShareEnum.ValuationFrequencyEnum.Annually:
                nextValuationDate = date.add(1, 'years');
                break;
            case FundShareEnum.ValuationFrequencyEnum.AtLeastAnnualy:
                nextValuationDate = date.add(1, 'years');
                break;
            case FundShareEnum.ValuationFrequencyEnum.Other:
                nextValuationDate = date.add(1, 'days');
                break;
            default:
                nextValuationDate = date.add(1, 'days');
        }
    
        return nextValuationDate.format('YYYY-MM-DD');
    }

}