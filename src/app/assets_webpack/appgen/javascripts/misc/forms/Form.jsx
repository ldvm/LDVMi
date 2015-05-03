import React from '../../../../../../node_modules/react/addons'
import reactMixin from 'react-mixin'
import _ from 'lodash'
import revalidator from 'revalidator'
import invariant from 'invariant'

/**
 * Component mixin that adds simple form validation using revalidator plugin.
 *
 * @property {boolean} valid - Is the data in the form valid
 * @property {Object[]} errors - List of errors in the form
 * @property {string[]} dirty - List of dirty form fields
 */
export default class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getStateFromProps(props);
        this.reset();
    }

    componentWillReceiveProps(nextProps) {
        this.reset();
        this.setState(this.getStateFromProps(nextProps));
    }

    componentDidMount() {
        this.reset();
    }

    componentWillUpdate(nextProps, nextState) {
        this.updateDirty(nextState);
        this.validate(nextState);
    }

    getValidationScheme() {
        invariant(this.constructor.validationScheme, 'Form ' + this.constructor.name + ' is missing validationScheme');
        return this.constructor.validationScheme;
    }

    /**
     * Reset form state.
     */
    reset() {
        this.valid = false;
        this.errors = [];
        this.dirty = [];
        this.validate(this.state);
    }

    getStateFromProps(props) {
        let state = {};

        // Use the scheme to generate empty state skelet.
        Object.getOwnPropertyNames(this.getValidationScheme().properties).forEach(
            (name) => state[name] = null);

        // Load default values (if any)
        if (props.defaults) {
            Object.assign(state, props.defaults);
        }

        return state;
    }

    /**
     * Update the list of dirty inputs.
     * @param {object} nextState
     */
    updateDirty(nextState) {
        for (var key in nextState) {
            if (nextState.hasOwnProperty(key) && this.state.hasOwnProperty(key)) {
                if (nextState[key] != this.state[key]) {
                    if (!_.contains(this.dirty, key)) {
                        this.dirty.push(key);
                    }
                }
            }
        }
    }

    /**
     * Perform validation of the current component state.
     * @param {object} state
     */
    validate(state) {
        var validation = revalidator.validate(state, this.getValidationScheme());
        this.valid = validation.valid;
        this.errors = validation.errors;
    }

    /**
     * Return object of connecting functions for given input. The connecting
     * functions will link input to the form and will affect input's visual
     * appearance depending on the validation state.
     * @param {string} name of input
     * @returns {{linkState: (*|ReactLink), bsStyle: Function, help: Function}}
     */
    connect(name) {
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
    }

    /**
     * Return error object for given input or null if there is no error.
     * @param {string} name of the input
     * @returns {object|null}
     */
    getError(name) {
        var errors = _.where(this.errors, {property: name});
        return errors.length === 0 ? null : errors[0];
    }

    /**
     * Return if given input is dirty.
     * @param {string} name
     * @returns {boolean}
     */
    isDirty(name) {
        return _.contains(this.dirty, name);
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.props.onSubmit) {
            console.log('Submitting form: ');
            console.log(this.state);
        } else {
            this.props.onSubmit(this.state);
        }
    }
};

let PropTypes = React.PropTypes;

Form.propTypes = {
    defaults: PropTypes.object,
    onSubmit: PropTypes.func
};


reactMixin(Form.prototype, React.addons.LinkedStateMixin);
