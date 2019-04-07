export interface NoneStringValueDescription {
  value: boolean | number | [];
}

export interface PropertyDescription {
  key: string;
  valueDescription: NoneStringValueDescription;
}

export interface ObjectDescription {
  propertyDescriptions: PropertyDescription[];
}
