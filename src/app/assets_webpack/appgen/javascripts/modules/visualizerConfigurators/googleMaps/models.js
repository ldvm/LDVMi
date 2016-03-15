import { List, Record } from 'immutable';
import { PromiseStatus } from '../../../ducks/promises'

export const Property = Record({
  label: '',
  uri: '',
  schemeUri: ''
});

export const SkosConcept = Record({
  label: '',
  uri: '',
  schemeUri: '',
  linkUris: List()
});

export const filterTypes = {
  CHECKBOX: 'CHECKBOX',
  RADIO: 'RADIO'
};

export const Filter = Record({
  property: new Property(),
  type: filterTypes.CHECKBOX,
  enabled: true,
  options: new Map(),
  optionsUris: new List()
});

export const optionModes = {
  SELECT_ALWAYS: 'SELECT_ALWAYS',
  SELECT_NEVER: 'SELECT_NEVER',
  USER_DEFINED: 'USER_DEFINED'
};

export const Option = Record({
  skosConcept: new SkosConcept(),
  count: null,
  mode: optionModes.USER_DEFINED,
  selected: false
});
