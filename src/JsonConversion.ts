import {
  ObjectValueDescription,
  NoneStringValueDescription,
  StringValueDescription,
  PlaceholderFunctionValueDescription,
  StringTemplate,
  getTypeFrom,
  Arg,
  JsonType,
  PluralFunctionValueDescription,
  ArgType,
  isStringValueDescription,
  ValueDescription,
  ValueType
} from "./IntermediateStructure";
import { getAllMatches } from "./RegexUtils";

interface PluralFormObject {
  [count: number]: string;
  n: string;
}

const placeholderRegex = /(?<!\\){\s*([^:\s]+)\s*:\s*([^}\s]+)\s*(?<!\\)}/gm;

export function convertJson(jsonString: string) {
  const json = JSON.parse(jsonString);
  return convertObject(json);
}

function convertObject(value: {}): ObjectValueDescription | PluralFunctionValueDescription {
  return isPluralFormObject(value) ? convertPluralFormObject(value) : convertSimpleObject(value);
}

function convertPluralFormObject(obj: PluralFormObject): PluralFunctionValueDescription {
  const fixedCountArg = { name: "count", type: ArgType.Number };
  const argMap = new Map<string, Arg>([[fixedCountArg.name, fixedCountArg]]);
  const values = getPluralFunctionValues(obj.n);

  const keys = Object.keys(obj);
  for (const key of keys) {
    if (key === "n") {
      continue;
    }

    const valueDescription = convertString(obj[key]);

    if (isStringValueDescription(valueDescription)) {
      values[key] = valueDescription.value;
      continue;
    }

    for (const arg of valueDescription.args) {
      if (argMap.has(arg.name)) {
        continue;
      }

      argMap.set(arg.name, arg);
    }

    values[key] = valueDescription.stringTemplate;
  }

  return {
    type: ValueType.PluralFunction,
    args: Array.from(argMap.values()),
    values
  };
}

function getPluralFunctionValues(nValue: string) {
  const nValueDescription = convertString(nValue);

  return isStringValueDescription(nValueDescription)
    ? { n: nValueDescription.value }
    : { n: nValueDescription.stringTemplate };
}

function convertSimpleObject(obj: {}): ObjectValueDescription {
  const propertyDescriptions = new Map<string, ValueDescription>();
  const keys = Object.keys(obj);

  for (const key of keys) {
    const value = obj[key];
    const valueType = typeof value;

    if (valueType === "string") {
      propertyDescriptions.set(key, convertString(value));
      continue;
    }

    // ignore arrays for the moment
    if (valueType === "object" && !Array.isArray(value)) {
      propertyDescriptions.set(key, convertObject(value));
      continue;
    }

    propertyDescriptions.set(key, convertNoneString(value));
  }

  return {
    type: ValueType.Object,
    propertyDescriptions
  };
}

function convertNoneString(value: number | boolean | JsonType[]): NoneStringValueDescription {
  return {
    type: ValueType.NoneString,
    value
  };
}

function convertString(value: string) {
  const placeholderMatches = Array.from(getAllMatches(value, placeholderRegex));

  return placeholderMatches.length === 0
    ? convertSimpleString(value)
    : convertStringToPlaceholderFunction(value, placeholderMatches);
}

function convertSimpleString(value: string): StringValueDescription {
  return {
    type: ValueType.String,
    value
  };
}

function convertStringToPlaceholderFunction(
  value: string,
  placeholderMatches: RegExpExecArray[]
): PlaceholderFunctionValueDescription {
  const argMap = new Map<string, Arg>();
  const stringTemplate: StringTemplate = [];

  let processedValue = value;
  for (const placeholderMatch of placeholderMatches) {
    const arg = {
      name: placeholderMatch[1],
      type: getTypeFrom(placeholderMatch[2])
    };

    if (!argMap.has(arg.name)) {
      argMap.set(arg.name, arg);
    }

    const splittedValue = processedValue.split(placeholderMatch[0]);
    processedValue = splittedValue[1];
    if (splittedValue[0] !== "") {
      stringTemplate.push(splittedValue[0]);
    }

    stringTemplate.push(arg);
  }

  if (processedValue !== "") {
    stringTemplate.push(processedValue);
  }

  return {
    type: ValueType.PlaceholderFunction,
    args: Array.from(argMap.values()),
    stringTemplate
  };
}

function isPluralFormObject(obj: { n?: string }): obj is PluralFormObject {
  return (
    obj.n !== undefined &&
    Object.keys(obj).every((key) => (key === "n" || /^\d+$/.test(key)) && typeof obj[key] === "string")
  );
}
