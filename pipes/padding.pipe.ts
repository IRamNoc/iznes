import { Pipe, PipeTransform } from '@angular/core';
import { pad } from '../helper/common';

@Pipe({ name: 'padding' })
export class PaddingPipe implements PipeTransform {
    transform(value: string, width: number = 0, fill: string = '0'): string {
        return pad(Number(value), width, fill);
    }
}
