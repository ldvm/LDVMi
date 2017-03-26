import rest from '../../../misc/rest'

export async function getEvents(applicationId, start, end, limit) {
    let payload = {"start":start, "end":end, "limit":limit};
    const result = await rest('eventVisualizer/getEvents/' + applicationId,payload);
    return result.data.events;
}

export async function getEventPeople(applicationId, event) {
    const result = await rest('eventVisualizer/getEventPeople/' + applicationId, {"event" : event});
    return result.data.people;
}