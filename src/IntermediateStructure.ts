import { pluralFormNthKey } from "./Configuration";
import { NoneStringJsonType } from "./JsonStructure";

export enum ValueDescriptionType {
  NoneString,
  String,
  PlaceholderFunction,
  Object,
  PluralFunction
}

export interface ValueDescription {
  type: ValueDescriptionType;
}

export interface NoneStringValueDescription extends ValueDescription {
  type: ValueDescriptionType.NoneString;
  value: NoneStringJsonType;
}

export interface StringValueDescription extends ValueDescription {
  type: ValueDescriptionType.String;
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
  type: ValueDescriptionType.PlaceholderFunction;
  args: Arg[];
  stringTemplate: StringTemplate;
}

export interface ObjectValueDescription extends ValueDescription {
  type: ValueDescriptionType.Object;
  propertyDescriptions: Map<string, ValueDescription>;
}

export interface PluralFormObjectDescription {
  [count: number]: StringTemplate | string;
  [pluralFormNthKey]: StringTemplate | string;
}

export interface PluralFunctionValueDescription extends ValueDescription {
  type: ValueDescriptionType.PluralFunction;
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
  return valueDescription.type === ValueDescriptionType.NoneString;
}

export function isStringValueDescription(
  valueDescription: ValueDescription
): valueDescription is StringValueDescription {
  return valueDescription.type === ValueDescriptionType.String;
}

export function isPlaceholderFunctionValueDescription(
  valueDescription: ValueDescription
): valueDescription is PlaceholderFunctionValueDescription {
  return valueDescription.type === ValueDescriptionType.PlaceholderFunction;
}

export function isObjectValueDescription(
  valueDescription: ValueDescription
): valueDescription is ObjectValueDescription {
  return valueDescription.type === ValueDescriptionType.Object;
}

export function isPluralFunctionValueDescription(
  valueDescription: ValueDescription
): valueDescription is PluralFunctionValueDescription {
  return valueDescription.type === ValueDescriptionType.PluralFunction;
}
