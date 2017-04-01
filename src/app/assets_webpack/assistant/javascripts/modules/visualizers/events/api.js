import rest from '../../../misc/rest'

export async function getEvents(applicationId, config) {
    var start = config.start.getTime();
    var end = config.end.getTime();
    var limit = parseInt(config.limit);

    let payload = {"start":start, "end":end, "limit":limit};
    const result = await rest('eventVisualizer/getEvents/' + applicationId,payload);
    return result.data.events;
}

export async function getEventPeople(applicationId, event) {
    const result = await rest('eventVisualizer/getEventPeople/' + applicationId, {"event" : event});
    return result.data.people;
}