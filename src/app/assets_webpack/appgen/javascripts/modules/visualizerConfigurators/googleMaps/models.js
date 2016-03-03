import { List, Record } from 'immutable';
import { types as propertyTypes } from './ducks/propertyConfigs'

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

export const PropertyConfig = Record({
  type: propertyTypes.CHECKBOX,
  enabled: true
});
