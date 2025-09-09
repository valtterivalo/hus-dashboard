"use client";
/**
 * @fileoverview simple shadcn table for yearly series (vuosi, arvo, absoluuttinen).
 */
import type { DenseYearSeries } from "@/types/sotkanet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Props = {
  title: string;
  series: DenseYearSeries;
  decimals: number;
  primarySuffix?: string;
};

export function SeriesTable({ title, series, decimals, primarySuffix = "" }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vuosi</TableHead>
                <TableHead>Arvo</TableHead>
                <TableHead>Absoluuttinen arvo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {series.map((p) => (
                <TableRow key={p.year}>
                  <TableCell>{p.year}</TableCell>
                  <TableCell className="font-mono tabular-nums">
                    {p.primaryValue === null
                      ? "–"
                      : `${p.primaryValue.toLocaleString("fi-FI", {
                          minimumFractionDigits: decimals,
                          maximumFractionDigits: decimals,
                        })}${primarySuffix}`}
                  </TableCell>
                  <TableCell className="font-mono tabular-nums">
                    {p.absoluteValue === null
                      ? "–"
                      : p.absoluteValue.toLocaleString("fi-FI", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
