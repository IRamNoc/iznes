import * as _ from 'lodash';

import {FormItem} from './DynamicForm';

export class DynamicFormsValidator {
    isValid() {
        let valid = true;

        _.forEach(this, (item: FormItem) => {
            if((!item.isValid) || !item.isValid()) valid = false;
        });

        return valid;
    }
}