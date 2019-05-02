import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'asset',
})
export class AssetPipe implements PipeTransform {
    transform(value: string, args: string[]): string {
        value = value.replace('|', '<span class="asset-pipe">|</span>');
        return value;
    }
}
