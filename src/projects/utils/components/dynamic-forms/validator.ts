import * as _ from 'lodash';
import { FormItem } from './DynamicForm';

export class DynamicFormsValidator {
    isValid() {
        let valid = true;

        _.forEach(this, (item: FormItem) => {
            if ((typeof item.isValid !== 'undefined') && !item.isValid()) valid = false;
        });

        return valid;
    }
}
