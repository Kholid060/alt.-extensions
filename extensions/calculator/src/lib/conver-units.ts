import configureMeasurements from 'convert-units';
// @ts-expect-error IDK
import allMeasures from 'convert-units/definitions/all';

export const convertUnits = configureMeasurements(allMeasures);
