export interface NoneStringValueDescription {
  value: boolean | number | [];
}

export interface StringValueDescription {
  value: string;
}

export interface PropertyDescription {
  key: string;
  valueDescription: NoneStringValueDescription | StringValueDescription;
}

export interface ObjectDescription {
  propertyDescriptions: PropertyDescription[];
}
