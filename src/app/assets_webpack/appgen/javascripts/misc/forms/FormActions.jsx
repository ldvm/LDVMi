import {dispatch} from '../../libs/dispatcher.jsx'

class FormActions {
    FORM_RESET(formName) {
        dispatch(this.FORM_RESET, {formName});
    }

    FORM_UPDATE(formName, state) {
        dispatch(this.FORM_UPDATE, {formName, state});
    }

    FORM_SET_DEFAULT(formName, state) {
        dispatch(this.FORM_SET_DEFAULT, {formName, state});
    }

    FORM_SHOW_ERRORS(formName) {
        dispatch(this.FORM_SHOW_ERRORS, {formName});
    }
}

export default new FormActions();