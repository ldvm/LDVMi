import { Record } from 'immutable';

export const EventInfo = Record({
    url: "url",
    name: "name",
    start: "start",
    end: "end",
    info: "info"
});

export const PersonInfo = Record({
    url: "url",
    name: "name",
    description: "description",
    image: "image_url",
    info: "info"
});

export const Configuration = Record({
    start: new Date("01 01 2010"),
    end: new Date("01 01 2018"),
    limit: 100
});


