import { Record } from 'immutable';

export const Interval = Record({
    url: "url",
    start: new Date(),
    end: new Date()
});

export const Instant = Record({
    url: "url",
    start: new Date(),
    end: new Date()
});

export const Connection = Record({
    outerThing: "url",
    connection: "url",
    innerThing: "url"
});

export const Count = Record({
    value: 123
});


export const Limit = Record({
    value: 100
});


