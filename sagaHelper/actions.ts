export const RUN_ASYNC_TASK = 'RUN_ASYNC_TASK';

export const runAsyncTask = (successTypes,
                             failureTypes,
                             descriptor,
                             args = {},
                             successCallback = () => true,
                             failureCallback = () => true) => (
    {
        type: RUN_ASYNC_TASK,
        successTypes,
        failureTypes,
        descriptor,
        args,
        successCallback,
        failureCallback

    }
);

export const runAsyncTaskCallback = (descriptor,
                                     successCallback = () => true,
                                     failureCallback = () => true) => (
    {
        type: RUN_ASYNC_TASK,
        successTypes: [],
        failureTypes: [],
        descriptor,
        args: {},
        successCallback,
        failureCallback

    }
);

export interface AsyncTaskResponseAction {
    type: string;
    payload: any;
}

