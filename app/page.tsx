"use client";
import * as React from "react";
import { SiteHeader } from "@/components/site-header";
import { IndicatorSelect } from "@/components/indicator-select";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { IndicatorKpis } from "@/components/indicator-kpis";
import { SeriesTable } from "@/components/series-table";
import { AppFooter } from "@/components/app-footer";

type MetaPayload = {
  id: number;
  titleFi: string;
  range: { start: number; end: number };
  decimals: number;
  primaryValueTypeFi: string;
  primaryValueTypeCode: string;
  updated: string | null;
};

type SeriesPayload = {
  indicator: number;
  region: number;
  gender: string;
  start: number;
  end: number;
  series: { year: number; primaryValue: number | null; absoluteValue: number | null }[];
};

const INDICATOR_IDS = [5070, 5342, 5358] as const;

export default function Page() {
  const [metas, setMetas] = React.useState<MetaPayload[]>([]);
  const [selectedId, setSelectedId] = React.useState<number>(INDICATOR_IDS[0]);
  const [series, setSeries] = React.useState<SeriesPayload | null>(null);
  const [yMode, setYMode] = React.useState<"primary" | "absolute">("primary");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // fetch metadata for all indicators on mount
  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await Promise.all(
          INDICATOR_IDS.map((id) => fetch(`/api/sotkanet/metadata/${id}`).then((r) => r.json()))
        );
        if (!isMounted) return;
        setMetas(res as MetaPayload[]);
      } catch {
        if (!isMounted) return;
        setError("virhe metadatan haussa");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // fetch series when selection changes or metas are ready
  React.useEffect(() => {
    if (!metas.length) return;
    let isMounted = true;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const meta = metas.find((m) => m.id === selectedId)!;
        const res = await fetch(
          `/api/sotkanet/series?indicator=${selectedId}&start=${meta.range.start}&end=${meta.range.end}&gender=total`
        );
        const json = (await res.json()) as SeriesPayload | { error: string };
        if (!isMounted) return;
        if (!("series" in json)) {
          setError("virhe datan haussa");
          setSeries(null);
        } else {
          setSeries(json);
        }
      } catch {
        if (isMounted) setError("virhe datan haussa");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [selectedId, metas]);

  const selectedMeta = metas.find((m) => m.id === selectedId) || null;
  const primarySuffix = selectedMeta?.primaryValueTypeCode === "PROS" ? " %" : "";

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 lg:px-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <IndicatorSelect
              options={metas.map((m) => ({ id: m.id, titleFi: m.titleFi }))}
              value={selectedId}
              onChange={(id) => setSelectedId(id)}
              isDisabled={!metas.length}
            />
          </div>

          {error ? (
            <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border px-4 py-3">
              {error}
            </div>
          ) : series && selectedMeta ? (
            series.series.every((p) => p.primaryValue === null && p.absoluteValue === null) ? (
              <div className="border-border/50 bg-muted/30 text-foreground rounded-md border px-4 py-3">
                ei dataa valitulle indikaattorille hus-alueella (id 629)
              </div>
            ) : (
              <>
                <IndicatorKpis
                  decimals={selectedMeta.decimals}
                  primarySuffix={primarySuffix}
                  points={series.series.map((s) => ({ year: s.year, primary: s.primaryValue, absolute: s.absoluteValue }))}
                />
                <ChartAreaInteractive
                  title={selectedMeta.titleFi}
                  description={`HUS (id 629), ${series.start}–${series.end} • ${selectedMeta.primaryValueTypeFi || ""}`}
                  decimals={selectedMeta.decimals}
                  points={series.series.map((s) => ({ year: s.year, primary: s.primaryValue, absolute: s.absoluteValue }))}
                  yMode={yMode}
                  onYModeChange={setYMode}
                  primarySuffix={primarySuffix}
                />
              </>
            )
          ) : (
            <div className="text-muted-foreground">{isLoading ? "ladataan…" : "ei dataa"}</div>
          )}

          {series && selectedMeta ? (
            <SeriesTable title="Vuosittainen aikasarja" series={series.series} decimals={selectedMeta.decimals} primarySuffix={primarySuffix} />
          ) : null}

          <AppFooter indicators={metas.map((m) => ({ id: m.id, titleFi: m.titleFi }))} />
        </div>
      </main>
    </div>
  );
}
