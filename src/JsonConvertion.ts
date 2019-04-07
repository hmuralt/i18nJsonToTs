import { ObjectDescription, NoneStringValueDescription, StringValueDescription } from "./IntermediateTypes";

export function convertJson(jsonString: string) {
  const json = JSON.parse(jsonString);
  return convertObject(json);
}

function convertObject(obj: {}): ObjectDescription {
  const keys = Object.keys(obj);

  const propertyDescriptions = keys.map((key) => {
    const value = obj[key];
    const valueDescription =
      typeof value === "string" ? convertStringPropertyValue(value) : convertNoneStringJsonPropertyValue(value);
    return {
      key,
      valueDescription
    };
  });

  return {
    propertyDescriptions
  };
}

function convertNoneStringJsonPropertyValue(value: number | boolean | []): NoneStringValueDescription {
  return {
    value
  };
}

function convertStringPropertyValue(value: string): StringValueDescription {
  return {
    value
  };
}
