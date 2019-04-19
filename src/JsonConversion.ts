import {
  ObjectValueDescription,
  NoneStringValueDescription,
  StringValueDescription,
  PlaceholderFunctionValueDescription,
  StringTemplate,
  getTypeFrom,
  Arg,
  PluralFunctionValueDescription,
  ArgType,
  isStringValueDescription,
  ValueDescription,
  ValueType
} from "./IntermediateStructure";
import { getAllMatches } from "./RegexUtils";
import { pluralFormNthKey, placeholderRegex } from "./Configuration";
import { NoneStringJsonType, PluralFormObject } from "./JsonStructure";

export function convertJson(jsonString: string) {
  const json = JSON.parse(jsonString);

  return convertObject(json);
}

function convertObject(value: {}): ObjectValueDescription | PluralFunctionValueDescription {
  return isPluralFormObject(value) ? convertPluralFormObject(value) : convertSimpleObject(value);
}

function convertPluralFormObject(obj: PluralFormObject): PluralFunctionValueDescription {
  const fixedCountArg = { name: "count", type: ArgType.Number };
  const argSet = createArgSet([fixedCountArg]);
  const values = getPluralFunctionValues(obj[pluralFormNthKey]);

  const keys = Object.keys(obj).filter((key) => key !== pluralFormNthKey);
  for (const key of keys) {
    const valueDescription = convertString(obj[key]);

    if (isStringValueDescription(valueDescription)) {
      values[key] = valueDescription.value;
      continue;
    }

    for (const arg of valueDescription.args) {
      argSet.add(arg);
    }

    values[key] = valueDescription.stringTemplate;
  }

  return {
    type: ValueType.PluralFunction,
    args: argSet.args,
    values
  };
}

function getPluralFunctionValues(nthValue: string) {
  const nthValueDescription = convertString(nthValue);

  return isStringValueDescription(nthValueDescription)
    ? { n: nthValueDescription.value }
    : { n: nthValueDescription.stringTemplate };
}

function convertSimpleObject(obj: {}): ObjectValueDescription {
  const propertyDescriptions = new Map<string, ValueDescription>();
  const keys = Object.keys(obj);

  for (const key of keys) {
    const value = obj[key];
    const valueType = typeof value;
    let valueDescription;

    if (valueType === "string") {
      valueDescription = convertString(value);
    } else if (valueType === "object" && !Array.isArray(value)) {
      valueDescription = convertObject(value);
    } else {
      valueDescription = convertNoneString(value);
    }

    propertyDescriptions.set(key, valueDescription);
  }

  return {
    type: ValueType.Object,
    propertyDescriptions
  };
}

function convertNoneString(value: NoneStringJsonType): NoneStringValueDescription {
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
  const argSet = createArgSet();
  const stringTemplateBuilder = createStringTemplateBuilder(value);

  for (const placeholderMatch of placeholderMatches) {
    const arg = {
      name: placeholderMatch[1],
      type: getTypeFrom(placeholderMatch[2])
    };

    argSet.add(arg);
    stringTemplateBuilder.add(arg, placeholderMatch[0]);
  }

  return {
    type: ValueType.PlaceholderFunction,
    args: argSet.args,
    stringTemplate: stringTemplateBuilder.stringTemplate
  };
}

function isPluralFormObject(obj: { [pluralFormNthKey]?: string }): obj is PluralFormObject {
  return (
    obj[pluralFormNthKey] !== undefined &&
    Object.keys(obj).every((key) => (key === pluralFormNthKey || /^\d+$/.test(key)) && typeof obj[key] === "string")
  );
}

function createArgSet(initialArgs: Arg[] = []) {
  const argMap = new Map<string, Arg>(initialArgs.map((initialArg) => [initialArg.name, initialArg]));

  return {
    add(arg: Arg) {
      if (argMap.has(arg.name)) {
        return;
      }

      argMap.set(arg.name, arg);
    },
    get args() {
      return Array.from(argMap.values());
    }
  };
}

function createStringTemplateBuilder(value: string) {
  const stringTemplate: StringTemplate = [];
  let unprocessedValue = value;

  return {
    add(arg: Arg, argStringMatch: string) {
      const splitValue = unprocessedValue.split(argStringMatch);
      unprocessedValue = splitValue[1];

      if (splitValue[0] !== "") {
        stringTemplate.push(splitValue[0]);
      }

      stringTemplate.push(arg);
    },
    get stringTemplate() {
      if (unprocessedValue !== "") {
        stringTemplate.push(unprocessedValue);
      }

      return stringTemplate;
    }
  };
}
