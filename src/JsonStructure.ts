import { pluralFormNthKey } from "./Configuration";

export type JsonType = boolean | number | string | object;

export type NoneStringJsonType = boolean | number | JsonType[];

export interface PluralFormObject {
  [count: number]: string;
  [pluralFormNthKey]: string;
}
