import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'percentage' })
export class PercentagePipe implements PipeTransform {
    transform(value: any): any {
        if (value !== null) {
            if (typeof value !== 'number') {
                value = Number(value);
            }
            return `${value.toFixed(2)}%`;
        }
        return '';
    }
}
