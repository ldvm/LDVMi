import {Dispatcher} from 'flux'
import debug from '../misc/debug.jsx'
debug = debug('Dispatcher');

const dispatcher = new Dispatcher;

export default {
    register: (callback) => dispatcher.register(callback),
    dispatch: (action, payload) => {
        debug('Dispatching action ' + (action.name || action));
        dispatcher.dispatch({action, payload})
    }
};