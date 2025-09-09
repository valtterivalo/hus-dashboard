/**
 * @fileoverview small kpi cards for the selected indicator, style directly from shadcn components.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Point = { year: number; primary: number | null; absolute: number | null };

type Props = {
  points: Point[];
  decimals: number;
  primarySuffix?: string;
};

function formatNumber(n: number, decimals: number) {
  return n.toLocaleString("fi-FI", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function IndicatorKpis({ points, decimals, primarySuffix = "" }: Props) {
  const nonNull = points.filter((p) => typeof p.primary === "number");
  const last = [...nonNull].reverse()[0] ?? null;
  const prev = [...nonNull].reverse()[1] ?? null;
  const years = points.length > 0 ? [points[0].year, points[points.length - 1].year] : [null, null];
  const coverage = `${nonNull.length}/${points.length}`;

  const latestAbs = [...points].reverse().find((p) => typeof p.absolute === "number")?.absolute ?? null;

  const delta = last && prev ? (last.primary as number) - (prev.primary as number) : null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Viimeisin arvo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {last?.primary == null ? "–" : `${formatNumber(last.primary as number, decimals)}${primarySuffix}`}
          </div>
          <div className="text-muted-foreground text-xs">Vuosi {last?.year ?? "–"}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Muutos edellisvuoteen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {delta == null ? "–" : (delta > 0 ? "+" : "") + formatNumber(delta, decimals) + primarySuffix}
          </div>
          <div className="text-muted-foreground text-xs">Sama yksikkö kuin arvo</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Viimeisin absoluuttinen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {latestAbs == null ? "–" : Math.round(latestAbs).toLocaleString("fi-FI")}
          </div>
          <div className="text-muted-foreground text-xs">Lukumäärä</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Saatavuus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{coverage}</div>
          <div className="text-muted-foreground text-xs">
            Vuosilta {years[0] ?? "–"}–{years[1] ?? "–"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
