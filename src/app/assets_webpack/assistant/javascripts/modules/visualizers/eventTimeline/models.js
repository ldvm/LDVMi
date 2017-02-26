import { Record } from 'immutable';

export const Event = Record({
    url: "Event url",
    name: "Event name",
    start: date("1.1.2000"),
    end: date("1.1.2000"),
    info: "Event info"
});


