import {Map, Record, fromJS} from 'immutable'

import BaseStore from '../../libs/BaseStore.jsx'
import state from '../../libs/state.jsx'
import actions from './FormActions.jsx'

const EmptyFormState = Record({
    data: new Map(),
    dirty: new Map(),
    validation: { valid: true, errors: [] },
    showErrors: false
});

class FormStore extends BaseStore {
    constructor(state) {
        super(this._handleAction.bind(this));
        this.stateCursor = state.cursor([this.constructor.name, 'state'], {});
        this.defaultStateCursor = state.cursor([this.constructor.name, 'defaultState'], {});
    }

    _handleAction({action, payload: {formName, state}}) {
        switch (action) {

            case actions.FORM_UPDATE:
            case actions.FORM_SET_DEFAULT:
                this.stateCursor(states => states.set(formName, state));

                if (action === actions.FORM_SET_DEFAULT) {
                    this.defaultStateCursor(states => states.set(formName, state));
                }

                this.emitChange();
                break;

            case actions.FORM_SHOW_ERRORS:
                this.stateCursor(states => states.setIn([formName, 'showErrors'], true));
                this.emitChange();
                break;

            case actions.FORM_RESET:
                this.stateCursor(states => states.set(payload, this.defaultStateCursor().get(payload)));
                this.emitChange();
                break;
        }
    }

    getEmptyFormState() {
        return new EmptyFormState().toMap();
    }

    getFormState(formName) {
        return this.stateCursor().get(formName);
    }

    getFormData(formName) {
        return (this.getFormState(formName) || this.getEmptyFormState()).get('data').toJS();
    }
}

export default new FormStore(state);