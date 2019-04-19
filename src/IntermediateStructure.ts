import { pluralFormNthKey } from "./Configuration";
import { PrimitiveJsonType } from "./JsonStructure";

export enum ValueDescriptionType {
  Primitive,
  PlaceholderFunction,
  Object,
  PluralFunction,
  Array
}

export interface ValueDescription {
  type: ValueDescriptionType;
}

export interface PrimitiveValueDescription<TPrimitive extends PrimitiveJsonType = PrimitiveJsonType>
  extends ValueDescription {
  type: ValueDescriptionType.Primitive;
  value: TPrimitive;
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

export interface ArrayValueDescription extends ValueDescription {
  type: ValueDescriptionType.Array;
  valueDescriptions: ValueDescription[];
}

const reverseArgType = new Map(Object.keys(ArgType).map((argTypeKey) => [ArgType[argTypeKey], argTypeKey]));

export function getTypeFrom(typeName: string): ArgType {
  const argTypeKey = reverseArgType.get(typeName);

  return argTypeKey !== undefined ? ArgType[argTypeKey] : ArgType.String;
}

export function isPrimitiveValueDescription(
  valueDescription: ValueDescription
): valueDescription is PrimitiveValueDescription {
  return valueDescription.type === ValueDescriptionType.Primitive;
}

export function isPrimitiveStringValueDescription(
  valueDescription: ValueDescription
): valueDescription is PrimitiveValueDescription<string> {
  return (
    valueDescription.type === ValueDescriptionType.Primitive &&
    typeof (valueDescription as PrimitiveValueDescription).value === "string"
  );
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

export function isArrayValueDescription(valueDescription: ValueDescription): valueDescription is ArrayValueDescription {
  return valueDescription.type === ValueDescriptionType.Array;
}
