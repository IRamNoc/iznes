export const RUN_ASYNC_TASK = 'RUN_ASYNC_TASK';

export const runAsyncTask = (successTypes, failureTypes, descriptor, args) => (
    {
        type: RUN_ASYNC_TASK,
        successTypes,
        failureTypes,
        descriptor,
        args
    }
);

export interface AsyncTaskResponseAction {
    type: string;
    payload: any;
}

