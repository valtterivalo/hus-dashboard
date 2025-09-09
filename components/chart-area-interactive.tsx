"use client";
/**
 * @fileoverview shadcn-styled area chart adapted for sotkanet series.
 */
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "HUS area-style chart using shadcn primitives";

type Point = { year: number; primary: number | null; absolute: number | null };

type Props = {
  title: string;
  description: string;
  decimals: number;
  points: Point[];
  yMode: "primary" | "absolute";
  onYModeChange: (mode: "primary" | "absolute") => void;
  primarySuffix?: string;
};

const chartConfig = {
  primary: { label: "Arvo", color: "var(--primary)" },
  absolute: { label: "Absoluuttinen arvo", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

export function ChartAreaInteractive({ title, description, decimals, points, yMode, onYModeChange, primarySuffix = "" }: Props) {
  const data = React.useMemo(
    () => points.map((p) => ({ year: p.year, primary: p.primary, absolute: p.absolute })),
    [points]
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={yMode}
            onValueChange={(v) => onYModeChange((v as "primary" | "absolute") ?? yMode)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="primary">Arvo</ToggleGroupItem>
            <ToggleGroupItem value="absolute">Abs. arvo</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillAbsolute" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-absolute)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-absolute)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelKey="year"
                  formatter={(value, name) => {
                    const d = yMode === "primary" ? decimals : 0;
                    const num =
                      typeof value === "number"
                        ? value.toLocaleString("fi-FI", { minimumFractionDigits: d, maximumFractionDigits: d })
                        : String(value);
                    const withSuffix = yMode === "primary" ? `${num}${primarySuffix}` : num;
                    return (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{name}</span>
                        <span className="font-mono tabular-nums">{withSuffix}</span>
                      </div>
                    );
                  }}
                  indicator="dot"
                />
              }
            />
            {yMode === "primary" ? (
              <Area dataKey="primary" type="natural" fill="url(#fillPrimary)" stroke="var(--color-primary)" connectNulls={false} />
            ) : (
              <Area dataKey="absolute" type="natural" fill="url(#fillAbsolute)" stroke="var(--color-absolute)" connectNulls={false} />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
