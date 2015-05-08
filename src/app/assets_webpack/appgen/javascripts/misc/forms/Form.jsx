import React from '../../../../../../node_modules/react/addons'
import reactMixin from 'react-mixin'
import _ from 'lodash'
import revalidator from 'revalidator'
import invariant from 'invariant'
import Immutable from 'immutable'
import deepEqual from 'deep-equal'

import FormStore from './FormStore.jsx'
import FormActions from './FormActions.jsx'

export default class Form extends React.Component {

    constructor(props) {
        super(props);
        this._onPropsChange(props);
    }

    componentWillReceiveProps(props) {
        if (!deepEqual(this.props.defaults, props.defaults)) {
            // Let's make the update asynchronous to avoid breaking Flux cycle (in case we
            // are currently inside an action dispatch)
            setTimeout(() => this._onPropsChange(props), 0);
        }
    }

    componentDidMount() {
        FormStore.addChangeListener(this._handleStoresChanged.bind(this));
    }

    componentWillUnmount() {
        FormStore.removeChangeListener(this._handleStoresChanged.bind(this));
    }

    _handleStoresChanged() {
        this.forceUpdate();
    }

    _onPropsChange(props) {
        let data = {};

        // Use the scheme to generate empty values.
        Object.getOwnPropertyNames(this.getValidationScheme().properties).forEach(
            (name) => data[name] = '');

        // Load default values (if any)
        if (props.defaults) {
            Object.assign(data, props.defaults);
        }

        const defaultState = FormStore.getEmptyFormState()
            .set('data', Immutable.fromJS(data))
            .update(state => state.set('validation', this._validate(data)));
        FormActions.FORM_SET_DEFAULT(this.getName(), defaultState);
    }

    _onChange({target: {name, value}}) {
        const newState = this.getFormState()
            .setIn(['data', name], value)
            .setIn(['dirty', name], true)
            .update(state => state.set('validation', this._validate(state.get('data').toJS())));
        FormActions.FORM_UPDATE(this.getName(), newState);
    }

    _validate(data) {
        return revalidator.validate(data, this.getValidationScheme());
    }

    connect(name) {
        return {
            name: name,
            onChange: this._onChange.bind(this),
            bsStyle: this.showErrors() ? (this.getError(name) ? 'error' : 'success') : null,
            help: this.showErrors() && this.getError(name) && this.getError(name).message || null,
            value: this.getValue(name)
        };
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.isValid()) {
            if (!this.props.onSubmit) {
                console.log('No onSubmit handler set! Printing values.');
                console.log(this.getFormState().get('data').toJS());
            } else {
                this.props.onSubmit(this.getFormState().get('data').toJS());
            }
        } else {
            FormActions.FORM_SHOW_ERRORS(this.getName());
        }
    }

    getName() {
        return this.props.name || this.constructor.name;
    }

    getValidationScheme() {
        invariant(this.constructor.validationScheme, 'Form ' + this.constructor.name + ' is missing validationScheme');
        return this.constructor.validationScheme;
    }

    getFormState() {
        return FormStore.getFormState(this.getName());
    }

    isDirty(name) {
        return this.getFormState().get('dirty').get(name);
    }

    isValid() {
        return this.getFormState().get('validation').valid;
    }

    showErrors() {
        return this.getFormState().get('showErrors');
    }

    getError(name) {
        var errors = this.getFormState().get('validation').errors.filter(e => e.property == name);
        return errors.length === 0 ? null : errors[0];
    }

    getValue(name) {
        return this.getFormState().get('data').get(name);
    }
};

Form.propTypes = {
    defaults: React.PropTypes.object,
    onSubmit: React.PropTypes.func,
    disabled: React.PropTypes.bool
};
