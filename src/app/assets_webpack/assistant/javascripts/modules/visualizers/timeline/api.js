import rest from '../../../misc/rest'
import { applyByBatchesCount, applyByBatchesWithLimit } from '../../common/utils/apiUtils'

const BATCH_SIZE = 100;

export async function getIntervals(applicationId, urls, timeRange, limit) {
  const batchFunc = async function (batchUrls, batchLimit) {
    let payload = {
      'urls': batchUrls,
      'start': timeRange.begin.getTime(),
      'end': timeRange.end.getTime(),
      'limit': batchLimit
    };

    const result = await rest('timeLineVisualizer/getIntervals/' + applicationId, payload);
    return result.data.intervals;
  };
  return applyByBatchesWithLimit(urls, BATCH_SIZE, limit, batchFunc);
}

export async function getInstants(applicationId, urls, timeRange, limit) {
  const batchFunc = async function (batchUrls, batchLimit) {
    let payload = {
      'urls': batchUrls,
      'start': timeRange.begin.getTime(),
      'end': timeRange.end.getTime(),
      'limit': batchLimit
    };

    const result = await rest('timeLineVisualizer/getInstants/' + applicationId, payload);
    return result.data.instants;
  };
  return applyByBatchesWithLimit(urls, BATCH_SIZE, limit, batchFunc);
}

export async function getThingsWIntervals(applicationId, things, thingTypes, predicates, limit) {
  const batchFunc = async function (batchThings, batchLimit) {
    let payload = {
      'things': batchThings,
      'thingTypes': thingTypes,
      'predicates': predicates,
      'limit': batchLimit
    };
    const result = await rest('timeLineVisualizer/getThingsWIntervals/' + applicationId, payload);
    return result.data.thingsWithIntervals;
  };
  return applyByBatchesWithLimit(things, BATCH_SIZE, limit, batchFunc);
}

export async function getThingsWInstants(applicationId, things, thingTypes, predicates, limit) {
  const batchFunc = async function (batchThings, batchLimit) {
    let payload = {
      'things': batchThings,
      'thingTypes': thingTypes,
      'predicates': predicates,
      'limit': batchLimit
    };
    const result = await rest('timeLineVisualizer/getThingsWInstants/' + applicationId, payload);
    return result.data.thingsWithInstants;
  };
  return applyByBatchesWithLimit(things, BATCH_SIZE, limit, batchFunc);
}

export async function getThingsWThingsWIntervals(applicationId, things, thingTypes, predicates, limit) {
  const batchFunc = async function (batchThings, batchLimit) {
    let payload = {
      'things': batchThings,
      'thingTypes': thingTypes,
      'predicates': predicates,
      'limit': batchLimit
    };
    const result = await rest('timeLineVisualizer/getThingsWThingsWIntervals/' + applicationId, payload);
    return result.data.thingsWithThingsWithIntervals;
  };
  return applyByBatchesWithLimit(things, BATCH_SIZE, limit, batchFunc);
}

export async function getThingsWThingsWInstants(applicationId, things, thingTypes, predicates, limit) {
  const batchFunc = async function (batchThings, batchLimit) {
    let payload = {
      'things': batchThings,
      'thingTypes': thingTypes,
      'predicates': predicates,
      'limit': batchLimit
    };
    const result = await rest('timeLineVisualizer/getThingsWThingsWInstants/' + applicationId, payload);
    return result.data.thingsWithThingsWithInstants;
  };
  return applyByBatchesWithLimit(things, BATCH_SIZE, limit, batchFunc);
}

export async function getIntervalsCount(applicationId, urls, timeRange) {
  const batchFunc = async function (batchUrls) {
    let payload = {
      'urls': batchUrls,
      'start': timeRange.begin.getTime(),
      'end': timeRange.end.getTime(),
      'limit': -1
    };
    const result = await rest('timeLineVisualizer/getIntervals/count/' + applicationId, payload);
    return result.data.count;
  };
  return applyByBatchesCount(urls, BATCH_SIZE, batchFunc);
}

export async function getInstantsCount(applicationId, urls, timeRange) {
  const batchFunc = async function (batchUrls) {
    let payload = {
      'urls': batchUrls,
      'start': timeRange.begin.getTime(),
      'end': timeRange.end.getTime(),
      'limit': -1
    };
    const result = await rest('timeLineVisualizer/getInstants/count/' + applicationId, payload);
    return result.data.count;
  };
  return applyByBatchesCount(urls, BATCH_SIZE, batchFunc);
}

export async function getThingsWIntervalsCount(applicationId, things, thingTypes, predicates) {
  const batchFunc = async function (batchThings) {
    let payload = {
      'things': batchThings,
      'thingTypes': thingTypes,
      'predicates': predicates,
      'limit': -1
    };
    const result = await rest('timeLineVisualizer/getThingsWIntervals/count/' + applicationId, payload);
    return result.data.count;
  };
  return applyByBatchesCount(things, BATCH_SIZE, batchFunc);
}

export async function getThingsWInstantsCount(applicationId, things, thingTypes, predicates) {
  const batchFunc = async function (batchThings) {
    let payload = {
      'things': batchThings,
      'thingTypes': thingTypes,
      'predicates': predicates,
      'limit': -1
    };

    const result = await rest('timeLineVisualizer/getThingsWInstants/count/' + applicationId, payload);
    return result.data.count;

  };
  return applyByBatchesCount(things, BATCH_SIZE, batchFunc);
}

export async function getThingsWThingsWIntervalsCount(applicationId, things, thingTypes, predicates) {
  const batchFunc = async function (batchThings) {
    let payload = {
      'things': batchThings,
      'thingTypes': thingTypes,
      'predicates': predicates,
      'limit': -1
    };
    const result = await rest('timeLineVisualizer/getThingsWThingsWIntervals/count/' + applicationId, payload);
    return result.data.count;
  };
  return applyByBatchesCount(things, BATCH_SIZE, batchFunc);
}

export async function getThingsWThingsWInstantsCount(applicationId, things, thingTypes, predicates) {
  const batchFunc = async function (batchThings) {
    let payload = {
      'things': batchThings,
      'thingTypes': thingTypes,
      'predicates': predicates,
      'limit': -1
    };
    const result = await rest('timeLineVisualizer/getThingsWThingsWInstants/count/' + applicationId, payload);
    return result.data.count;
  };
  return applyByBatchesCount(things, BATCH_SIZE, batchFunc);
}