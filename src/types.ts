export type Timestamp = number;

export type SingleValue = number | null;
export type MultiValue = Array<number | null>;

export type RawDatum = [Timestamp, SingleValue | MultiValue];

export interface ChartDefinition {
  title: string;
  data: RawDatum[];
}

export function isMultiValue(value: SingleValue | MultiValue): value is MultiValue {
  return Array.isArray(value);
}
