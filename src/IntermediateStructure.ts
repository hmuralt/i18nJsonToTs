export type JsonType = string | number | object | boolean;

export enum PropertyType {
  NoneString,
  String,
  PlaceholderFunction,
  Object,
  PluralFormObject
}

export interface PropertyDescription<TValueDescription = {}> {
  type: PropertyType;
  key: string;
  valueDescription: TValueDescription;
}

export interface StringValueDescription {
  value: string;
}

export interface StringPropertyDescription extends PropertyDescription<StringValueDescription> {
  type: PropertyType.String;
}

export interface NoneStringValueDescription {
  value: boolean | number | JsonType[];
}

export interface NoneStringPropertyDescription extends PropertyDescription<NoneStringValueDescription> {
  type: PropertyType.NoneString;
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

export interface PlaceholderFunctionValueDescription {
  args: Arg[];
  stringTemplate: StringTemplate;
}

export interface PlaceholderFunctionPropertyDescription
  extends PropertyDescription<PlaceholderFunctionValueDescription> {
  type: PropertyType.PlaceholderFunction;
}

export interface ObjectValueDescription {
  propertyDescriptions: PropertyDescription[];
}

export interface ObjectPropertyDescription extends PropertyDescription<ObjectValueDescription> {
  type: PropertyType.Object;
}

export function getTypeFrom(typeName: string): ArgType {
  return ArgType[typeName] !== undefined ? ArgType[typeName] : ArgType.String;
}
