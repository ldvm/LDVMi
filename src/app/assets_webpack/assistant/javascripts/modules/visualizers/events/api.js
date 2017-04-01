import rest from '../../../misc/rest'

export async function getEvents(applicationId, config) {
    var start = config.start.getTime();
    var end = config.end.getTime();
    var limit = parseInt(config.limit);

    let payload = {"start":start, "end":end, "limit":limit};
    debugger;
    const result = await rest('eventVisualizer/getEvents/' + applicationId,payload);
    return result.data.events;
}

export async function getEventPeople(applicationId, eventUrl) {
    const result = await rest('eventVisualizer/getEventPeople/' + applicationId, {event : eventUrl});
    return result.data.people;
}