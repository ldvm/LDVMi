import { List, Record } from 'immutable'

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
  expanded: false,
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

export const Coordinates = Record({
  lat: 0,
  lng: 0
});

export const FullCoordinates = Record({
  url: 'url',
  longitude: 0,
  latitude: 0
});

export const Place = Record({
  url: 'url',
  placeType: 'type',
  coordinates: 'crd_url'
});

export const QuantifiedThing = Record({
  url: 'url',
  valuePredicate: 'value_conn',
  value: 0,
  placePredicate: 'place_conn',
  place: 'place_url'
});

export const QuantifiedPlace = Record({
  url: 'url',
  placeType: 'type',
  valuePredicate: 'value_conn',
  value: 0,
  coordinates: 'crd_url'
});

export const MapState = Record({
  center: new Coordinates(),
  zoomLevel: 0
});

export const PublishSettings = Record({
  refreshOnStartUp: true,
  showFilters: true,
  collapsibleFilters: true
});

export const Counts = Record({
  coordinates: 0,
  places: 0,
  quantifiedThings: 0,
  quantifiedPlaces: 0
});
