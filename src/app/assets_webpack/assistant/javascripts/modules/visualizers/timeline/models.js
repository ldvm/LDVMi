import { Record } from 'immutable'

export const Interval = Record({
  url: 'url',
  begin: new Date(),
  end: new Date()
});

export const Instant = Record({
  url: 'url',
  date: new Date()
});

export const Connection = Record({
  outer: 'thing_url',
  outerType: 'type_url',
  predicate: 'predicate_url',
  inner: 'thing_url'
});

export const Count = Record({
  zero: 0,
  first: 0,
  second: 0
});

export const TimeRange = Record({
  begin: new Date('2000-01-01'),
  end: new Date('2018-01-01')
});


