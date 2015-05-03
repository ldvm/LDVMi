import _ from 'lodash'
import revalidator from 'revalidator'

/**
 * Component mixin that adds simple form validation using revalidator plugin.
 *
 * @property {boolean} valid - Is the data in the form valid
 * @property {Object[]} errors - List of errors in the form
 * @property {string[]} dirty - List of dirty form fields
 */
export default {

    componentWillReceiveProps: function () {
        this.reset();
    },

    componentWillMount: function () {
        this.reset();
    },

    componentWillUpdate: function (nextProps, nextState) {
        this.updateDirty(nextState);
        this.validate(nextState);
    },

    /**
     * Reset form state.
     */
    reset: function () {
        this.valid = false;
        this.errors = [];
        this.dirty = [];
    },

    /**
     * Update the list of dirty inputs.
     * @param {object} nextState
     */
    updateDirty: function (nextState) {
        for (var key in nextState) {
            if (nextState.hasOwnProperty(key) && this.state.hasOwnProperty(key)) {
                if (nextState[key] != this.state[key]) {
                    if (!_.contains(this.dirty, key)) {
                        this.dirty.push(key);
                    }
                }
            }
        }
    },

    /**
     * Perform validation of the current component state.
     * @param {object} state
     */
    validate: function (state) {
        var validation = revalidator.validate(state, this.getValidationScheme());
        this.valid = validation.valid;
        this.errors = validation.errors;
    },

    /**
     * Return object of connecting functions for given input. The connecting
     * functions will link input to the form and will affect input's visual
     * appearance depending on the validation state.
     * @param {string} name of input
     * @returns {{linkState: (*|ReactLink), bsStyle: Function, help: Function}}
     */
    connect: function (name) {
        var form = this;

        return {
            valueLink: form.linkState(name),

            /**
             * Bootstrap style class depending on validation state.
             * @returns {string}  (error|success|null)
             */
            bsStyle: function () {
                if (!form.isDirty(name)) {
                    return null;
                }
                var error = form.getError(name);
                return error ? 'error' : 'success';
            },

            /**
             * Validation message as Bootstrap's help text.
             * @returns {string} message or null
             */
            help: function () {
                if (!form.isDirty(name)) {
                    return null;
                }
                var error = form.getError(name);
                return error ? error.message : null;
            }
        };
    },

    /**
     * Return error object for given input or null if there is no error.
     * @param {string} name of the input
     * @returns {object|null}
     */
    getError: function (name) {
        var errors = _.where(this.errors, {property: name});
        return errors.length === 0 ? null : errors[0];
    },

    /**
     * Return if given input is dirty.
     * @param {string} name
     * @returns {boolean}
     */
    isDirty: function (name) {
        return _.contains(this.dirty, name);
    }
};
