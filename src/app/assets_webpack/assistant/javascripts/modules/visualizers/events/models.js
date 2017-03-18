import { Record } from 'immutable';

export const EventInfo = Record({
    url: "url",
    name: "name",
    start: new Date(),
    end: new Date(),
    info: "Event info"
});


