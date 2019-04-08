import {
  ObjectDescription,
  NoneStringValueDescription,
  StringValueDescription,
  PlaceholderFunctionValueDescription,
  StringTemplate,
  getTypeFrom,
  NoneStringPropertyDescription,
  StringPropertyDescription,
  PlaceholderFunctionPropertyDescription,
  PropertyType,
  Arg
} from "./IntermediateStructure";
import { getAllMatches } from "./RegexUtils";

const placeholderRegex = /(?<!\\){\s*([^:\s]+)\s*:\s*([^}\s]+)\s*(?<!\\)}/gm;

export function convertJson(jsonString: string) {
  const json = JSON.parse(jsonString);
  return convertObject(json);
}

function convertObject(obj: {}): ObjectDescription {
  const keys = Object.keys(obj);

  const propertyDescriptions = keys.map((key) => {
    const value = obj[key];
    return typeof value === "string" ? convertStringProperty(key, value) : convertNoneStringProperty(key, value);
  });

  return {
    propertyDescriptions
  };
}

function convertNoneStringProperty(key: string, value: number | boolean | []): NoneStringPropertyDescription {
  return {
    type: PropertyType.NoneString,
    key,
    valueDescription: convertNoneStringValue(value)
  };
}

function convertNoneStringValue(value: number | boolean | []): NoneStringValueDescription {
  return {
    value
  };
}

function convertStringProperty(
  key: string,
  value: string
): StringPropertyDescription | PlaceholderFunctionPropertyDescription {
  const placeholderMatches = Array.from(getAllMatches(value, placeholderRegex));

  if (placeholderMatches.length === 0) {
    return {
      type: PropertyType.String,
      key,
      valueDescription: convertStringValue(value)
    };
  }

  return {
    type: PropertyType.PlaceholderFunction,
    key,
    valueDescription: convertStringValueToPlaceholderFunction(value, placeholderMatches)
  };
}

function convertStringValue(value: string): StringValueDescription {
  return {
    value
  };
}

function convertStringValueToPlaceholderFunction(
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
    args: Array.from(argMap.values()),
    stringTemplate
  };
}
