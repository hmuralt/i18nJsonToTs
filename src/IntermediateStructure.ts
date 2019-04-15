import { pluralFormNthKey } from "./Configuration";
import { NoneStringJsonType } from "./JsonStructure";

export enum ValueType {
  NoneString,
  String,
  PlaceholderFunction,
  Object,
  PluralFunction
}

export interface ValueDescription {
  type: ValueType;
}

export interface NoneStringValueDescription extends ValueDescription {
  type: ValueType.NoneString;
  value: NoneStringJsonType;
}

export interface StringValueDescription extends ValueDescription {
  type: ValueType.String;
  value: string;
}

export enum ArgType {
  String = "string",
  Number = "number",
  ToString = "toString"
}

export interface Arg {
  name: string;
  type: ArgType;
}

export type StringTemplate = Array<string | Arg>;

export interface PlaceholderFunctionValueDescription extends ValueDescription {
  type: ValueType.PlaceholderFunction;
  args: Arg[];
  stringTemplate: StringTemplate;
}

export interface ObjectValueDescription extends ValueDescription {
  type: ValueType.Object;
  propertyDescriptions: Map<string, ValueDescription>;
}

export interface PluralFormObjectDescription {
  [count: number]: StringTemplate | string;
  [pluralFormNthKey]: StringTemplate | string;
}

export interface PluralFunctionValueDescription extends ValueDescription {
  type: ValueType.PluralFunction;
  args: Arg[];
  values: PluralFormObjectDescription;
}

const reverseArgType = new Map(Object.keys(ArgType).map((argTypeKey) => [ArgType[argTypeKey], argTypeKey]));

export function getTypeFrom(typeName: string): ArgType {
  const argTypeKey = reverseArgType.get(typeName);

  return argTypeKey !== undefined ? ArgType[argTypeKey] : ArgType.String;
}

export function isNoneStringValueDescription(
  valueDescription: ValueDescription
): valueDescription is NoneStringValueDescription {
  return valueDescription.type === ValueType.NoneString;
}

export function isStringValueDescription(
  valueDescription: ValueDescription
): valueDescription is StringValueDescription {
  return valueDescription.type === ValueType.String;
}

export function isPlaceholderFunctionValueDescription(
  valueDescription: ValueDescription
): valueDescription is PlaceholderFunctionValueDescription {
  return valueDescription.type === ValueType.PlaceholderFunction;
}

export function isObjectValueDescription(
  valueDescription: ValueDescription
): valueDescription is ObjectValueDescription {
  return valueDescription.type === ValueType.Object;
}

export function isPluralFunctionValueDescription(
  valueDescription: ValueDescription
): valueDescription is PluralFunctionValueDescription {
  return valueDescription.type === ValueType.PluralFunction;
}
