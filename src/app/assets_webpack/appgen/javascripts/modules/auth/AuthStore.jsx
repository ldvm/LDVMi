import BaseStore from '../../libs/BaseStore.jsx'
import state from '../../libs/state.jsx'
import actions from './authActions.jsx'

class AuthStore extends BaseStore {
    constructor(state) {
        super(this._handleAction.bind(this));

        this.store = state.cursor([AuthStore.name], {
            inProgress: false,
            user: {}
        });
        this.user = state.cursor([AuthStore.name, 'user'], {});
    }

    _handleAction({action, data}) {
        switch(action) {
            case actions.AUTH_IN_PROGRESS:
                this.store(store => store.set('inProgress', data.inProgress));
                this.emitChange();
                break;
        }
    }

    get inProgress() {
        return this.store().get('inProgress');
    }
}

export default new AuthStore(state);