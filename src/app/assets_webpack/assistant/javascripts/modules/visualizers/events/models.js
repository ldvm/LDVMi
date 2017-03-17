import { Record } from 'immutable';

export const Event = Record({
    url: "Event url",
    name: "Event name",
    start: new Date("1.1.2000"),
    end: new Date("1.1.2000"),
    info: "Event info"
});


