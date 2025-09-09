/**
 * @fileoverview utilities for transforming Sotkanet time series into dense year-aligned arrays.
 */
import type { DenseYearSeries, SotkanetDataRow } from "@/types/sotkanet";

/**
 * build an inclusive array of years from start to end.
 */
export function buildYearRange(start: number, end: number): number[] {
  if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) {
    throw new Error("invalid year range");
  }
  const years: number[] = [];
  for (let y = start; y <= end; y += 1) years.push(y);
  return years;
}

/**
 * convert sparse Sotkanet rows (single region) into a dense series across the given years.
 * missing years are filled with nulls.
 */
export function toDenseYearSeries(
  rows: SotkanetDataRow[],
  years: number[]
): DenseYearSeries {
  const byYear = new Map<number, SotkanetDataRow>();
  for (const r of rows) byYear.set(r.year, r);

  return years.map((year) => {
    const hit = byYear.get(year);
    return {
      year,
      primaryValue: typeof hit?.value === "number" ? hit!.value : null,
      absoluteValue: typeof hit?.absValue === "number" ? hit!.absValue : null,
    };
  });
}

