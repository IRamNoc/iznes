export const RUN_TASK = 'RUN_TASK';

export const runTask = (successType, failureType, descriptor, args) => (
    {
        type: RUN_TASK
        , successType
        , failureType
        , descriptor
        , args
    }
);
