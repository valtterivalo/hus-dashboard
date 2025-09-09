/**
 * @fileoverview type definitions for THL Sotkanet REST responses and normalized series.
 */

export type SotkanetGender = "total" | "male" | "female";

export type SotkanetIndicatorMetadata = {
  id: number;
  "data-updated"?: string;
  range: { start: number; end: number };
  title: { fi: string; sv?: string; en?: string };
  description?: { fi?: string; sv?: string; en?: string };
  primaryValueType?: {
    code: string;
    title?: { fi?: string; sv?: string; en?: string };
  };
  decimals?: number;
};

export type SotkanetDataRow = {
  indicator: number;
  region: number;
  year: number;
  gender: SotkanetGender;
  value?: number;
  absValue?: number;
};

export type DenseYearPoint = {
  year: number;
  primaryValue: number | null;
  absoluteValue: number | null;
};

export type DenseYearSeries = DenseYearPoint[];

