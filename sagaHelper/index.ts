import {identity} from 'ramda'
import * as actions from './actions'
import saga from './saga'

// Creates a task descriptor
const create = (fn) => {
    return {pipe: [fn]}
};

// Pipes task descriptors
const pipe = (...ds) => ds.reduce((piped, d) => {
    piped.pipe = piped.pipe.concat(d.pipe)
    return piped
}, {pipe: []})

const run = actions.runTask

export
{
    actions
    , saga
    , create
    , pipe
    , run
}
