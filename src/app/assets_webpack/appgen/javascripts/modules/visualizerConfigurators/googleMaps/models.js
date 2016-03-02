import { List, Record } from 'immutable';

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
