/**
 * @fileoverview next.js route: fetch sotkanet indicator metadata and return a trimmed payload.
 */
import { NextResponse } from "next/server";
import type { SotkanetIndicatorMetadata } from "@/types/sotkanet";

const SOTKANET_BASE = "https://sotkanet.fi/rest/1.1" as const;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const idNum = Number(id);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    return NextResponse.json({ error: "invalid indicator id" }, { status: 400 });
  }

  try {
    const res = await fetch(`${SOTKANET_BASE}/indicators/${idNum}`, {
      // note: idk if these should be hard coded but easy change
      next: { revalidate: 60 * 60 * 24 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `sotkanet metadata request failed (${res.status})` },
        { status: 502 }
      );
    }

    const meta = (await res.json()) as SotkanetIndicatorMetadata;
    const payload = {
      id: meta.id,
      titleFi: meta.title?.fi ?? String(meta.id),
      range: meta.range,
      decimals: meta.decimals ?? 0,
      primaryValueTypeFi: meta.primaryValueType?.title?.fi ?? "",
      primaryValueTypeCode: meta.primaryValueType?.code ?? "",
      updated: meta["data-updated"] ?? null,
    } as const;

    return NextResponse.json(payload, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
