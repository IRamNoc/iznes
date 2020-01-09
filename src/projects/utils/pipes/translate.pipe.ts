import { Pipe, PipeTransform } from '@angular/core';
import { MultilingualService } from '@setl/multilingual';

@Pipe({
    name: 'translate',
    pure: false, // add in this line, update value when we change language
})
export class TranslatePipe implements PipeTransform {

    constructor(
        private translate: MultilingualService,
    ) {

    }

    transform(value: any, params: any): any {
        if (value !== '' && value !== undefined) {
            // console.log('PIPE TRANSLATE FOR ' + value);
            return this.translate.translate(value, params);
        }
        return value;
    }
}
