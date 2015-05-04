import { EventEmitter } from 'events';
import dispatcher from './dispatcher.jsx';

export default class BaseStore extends EventEmitter {

    constructor(actionSubscribe) {
        this._dispatchToken = dispatcher.register(actionSubscribe);
    }

    get dispatchToken() {
        return this._dispatchToken;
    }

    emitChange() {
        this.emit('CHANGE');
    }

    addChangeListener(cb) {
        this.on('CHANGE', cb)
    }

    removeChangeListener(cb) {
        this.removeListener('CHANGE', cb);
    }
}