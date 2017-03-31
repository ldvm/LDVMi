import rest from '../../../misc/rest'

export async function getEvents(applicationId, start, end, limit) {
    let payload = {start:start.getTime(), end:end.getTime(), limit:limit};
    debugger;
    const result = await rest('eventVisualizer/getEvents/' + applicationId,payload);
    return result.data.events;
}

export async function getEventPeople(applicationId, eventUrl) {
    const result = await rest('eventVisualizer/getEventPeople/' + applicationId, {event : eventUrl});
    return result.data.people;
}