import rest from '../../../misc/rest'

export async function getEvents(applicationId) {
    const result = await rest('eventVisualizer/getEvent/' + applicationId, {});
    return result.data.event;
}