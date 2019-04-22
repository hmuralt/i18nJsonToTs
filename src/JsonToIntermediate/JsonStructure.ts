export type PrimitiveJsonType = boolean | number | string;

export const pluralFormNthKey = "n";

export interface PluralFormObject {
  [count: number]: string;
  [pluralFormNthKey]: string;
}
