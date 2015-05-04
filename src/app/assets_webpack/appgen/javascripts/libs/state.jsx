import Immutable from 'immutable'

class State {
    constructor() {
        this.state = Immutable.fromJS({});
    }

    set state(state) {
        if (this._state === state) return
        this._state = state
    }

    get state() {
        return this._state
    }

    cursor(path, defaultValue) {
        if (!this.state.getIn(path)) {
            this.state = this.state.updateIn(path, () => Immutable.fromJS(defaultValue));
        }
        return (update) => {
            if (update) {
                this.state = this.state.updateIn(path, update);
            } else {
                return this.state.getIn(path);
            }
        }
    }
}

export default new State();