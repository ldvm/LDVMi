import { Record } from 'immutable';

export const Interval = Record({
    url: "url",
    begin: new Date(),
    end: new Date()
});

export const Instant = Record({
    url: "url",
    date: new Date()
});

export const Connection = Record({
    outer: "thing_url",
    outerType: "type_url",
    connection: "url",
    inner: "thing_url"
});

export const Count = Record({
    zero: 0,
    first: 0,
    second:0
});


