/**
 * @fileoverview next.js route: fetch sotkanet indicator series for HUS region (id 629) and return dense year series.
 */
import { NextResponse } from "next/server";
import type { SotkanetDataRow, SotkanetIndicatorMetadata } from "@/types/sotkanet";
import { buildYearRange, toDenseYearSeries } from "@/lib/series";

const SOTKANET_BASE = "https://sotkanet.fi/rest/1.1" as const;
const HUS_REGION_ID = 629;

/**
 * query params:
 * - indicator: number (required)
 * - start: number (optional); if absent, inferred from metadata
 * - end: number (optional); if absent, inferred from metadata
 * - gender: 'total' | 'male' | 'female' (optional; default 'total')
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const indicator = Number(searchParams.get("indicator"));
  const startQ = searchParams.get("start");
  const endQ = searchParams.get("end");
  const genderQ = (searchParams.get("gender") ?? "total").toLowerCase();

  if (!Number.isInteger(indicator) || indicator <= 0) {
    return NextResponse.json({ error: "indicator is required" }, { status: 400 });
  }

  if (!["total", "male", "female"].includes(genderQ)) {
    return NextResponse.json({ error: "invalid gender" }, { status: 400 });
  }

  try {
    // determine year range
    let start: number;
    let end: number;
    if (startQ && endQ) {
      start = Number(startQ);
      end = Number(endQ);
      if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) {
        return NextResponse.json({ error: "invalid year range" }, { status: 400 });
      }
    } else {
      const metaRes = await fetch(`${SOTKANET_BASE}/indicators/${indicator}`, {
        next: { revalidate: 60 * 60 * 24 },
        headers: { Accept: "application/json" },
      });
      if (!metaRes.ok) {
        return NextResponse.json(
          { error: `sotkanet metadata request failed (${metaRes.status})` },
          { status: 502 }
        );
      }
      const meta = (await metaRes.json()) as SotkanetIndicatorMetadata;
      start = meta.range.start;
      end = meta.range.end;
    }

    const years = buildYearRange(start, end);
    const yearsQuery = years.map((y) => `years=${y}`).join("&");

    const dataRes = await fetch(
      `${SOTKANET_BASE}/json?indicator=${indicator}&genders=${genderQ}&${yearsQuery}`,
      {
        // avoid caching dynamic series during dev; okay to revalidate lightly in prod
        cache: "no-store",
        headers: { Accept: "application/json" },
      }
    );

    if (!dataRes.ok) {
      return NextResponse.json(
        { error: `sotkanet data request failed (${dataRes.status})` },
        { status: 502 }
      );
    }

    const rows = (await dataRes.json()) as SotkanetDataRow[];
    const husRows = rows.filter((r) => r.region === HUS_REGION_ID);
    const series = toDenseYearSeries(husRows, years);

    return NextResponse.json(
      {
        indicator,
        region: HUS_REGION_ID,
        gender: genderQ,
        start,
        end,
        series,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

