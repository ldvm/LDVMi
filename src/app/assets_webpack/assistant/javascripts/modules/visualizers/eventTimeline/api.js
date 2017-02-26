import rest from '../../../misc/rest'

export async function getEvent(applicationId) {
    const result = await rest('graphVisualizer/getEvent/' + applicationId, {});
    return result.data.event;
}