import rest from '../../../misc/rest'

export async function getEvents(applicationId) {
    const result = await rest('eventVisualizer/getEvents/' + applicationId, {});
    return result.data.events;
}