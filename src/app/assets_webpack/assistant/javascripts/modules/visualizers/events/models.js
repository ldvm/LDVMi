import { Record } from 'immutable';

export const EventInfo = Record({
    url: "url",
    name: "name",
    date: new Date("2001-01-01"),
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
    start: new Date("01 01 2000"),
    end: new Date("01 01 2018"),
    limit: 100
});

export const SelectedEvent = Record({
    isValid: false,
    event: new EventInfo
});


