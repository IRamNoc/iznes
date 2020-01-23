import { get } from 'lodash';
import { name } from './__init__';

export const SET_REQUESTED_LEI = `${name}/SET_REQUESTED_LEI`;
export const CLEAR_REQUESTED_LEI = `${name}/CLEAR_REQUESTED_LEI`;
export const SET_LEI_LIST = `${name}/SET_LEI_LIST`;

export const setLeiList = (fetchedData) => {
    const data: {legalEntityIdentifier: string}[] = get(fetchedData, [1, 'Data']);
    return {
        type: SET_LEI_LIST,
        payload: data.map(v => v.legalEntityIdentifier),
    };
};
