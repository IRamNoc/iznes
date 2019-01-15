import {get} from 'lodash';

/**
 * Extract response data from membernode response
 * @param metadata: isList whether return list not just first item of the list. property is single property we want to return
 * @constructor
 */
export function ExtractMNResponse(metadata: {isList?: boolean; property?: string;} = {isList: true, property: undefined}) {
    return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function() {
            const context = this
            const args = arguments;

            return originalMethod.apply(context, args).then(d => {
                if (typeof metadata.property !== 'undefined') {
                    return get(d, ['1', 'Data', '0', metadata.property]);
                } else {
                    return metadata.isList ? get(d, '[1].Data') : get(d, '[1].Data[0]');
                }
            });
        };
        return descriptor;
    }
};
