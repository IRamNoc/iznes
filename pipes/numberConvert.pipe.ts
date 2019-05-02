import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberConvert' })
export class NumberConvertPipe implements PipeTransform {
    transform(value: number, decimals): number {
        if (value === 0) {
            return 0;
        }
        return value / decimals;
    }
}
