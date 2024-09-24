import { Converter } from 'convert-units';
import { convertUnits } from '../lib/convert-units';

const CONNECTOR_WORDS = new Set(['to', 'as', 'in']);

interface UnitToken {
  value: number;
  toUnit?: string;
  fromUnit: string;
  converter: Converter<string, string, string>;
}

function convertUnitValue(text: string): UnitToken {
  const words = text.split(/(\s+)/).filter((word) => word.trim());

  const value = +(words.at(0) ?? NaN);
  if (Number.isNaN(value)) throw new Error('Input a number first');

  let converter = convertUnits(value);

  let fromUnit = words.at(1);
  if (!fromUnit) throw new Error('Missing unit');

  fromUnit = converter.getUnit(fromUnit)?.abbr;
  if (!fromUnit) throw new Error(`"${words[1]}" is invalid unit`);

  converter = converter.from(fromUnit);

  let toUnit = words.at(2);
  if (!toUnit) return { value, fromUnit, converter };

  toUnit = CONNECTOR_WORDS.has(toUnit)
    ? undefined
    : converter.getUnit(toUnit)?.abbr;
  if (toUnit && !words.at(3)) return { value, fromUnit, converter, toUnit };

  toUnit = words.at(3);
  if (!toUnit) return { value, fromUnit, converter };

  toUnit = converter.getUnit(toUnit)?.abbr;
  if (!toUnit) {
    throw new Error(
      `"${words[3]}" is invalid unit. \nPossible units: ${converter.possibilities().join(', ')}`,
    );
  }

  return {
    value,
    toUnit,
    fromUnit,
    converter,
  };
}

export default convertUnitValue;
