import { pluralFormNthKey } from "./Configuration";

export type PrimitiveJsonType = boolean | number | string;

export interface PluralFormObject {
  [count: number]: string;
  [pluralFormNthKey]: string;
}
