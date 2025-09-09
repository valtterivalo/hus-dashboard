"use client";
/**
 * @fileoverview indicator select component (fi). lists fixed indicator ids with titles from metadata.
 */
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type IndicatorOption = {
  id: number;
  titleFi: string;
};

type Props = {
  options: IndicatorOption[];
  value: number;
  onChange: (id: number) => void;
  isDisabled?: boolean;
};

export function IndicatorSelect({ options, value, onChange, isDisabled }: Props) {
  return (
    <div className="flex w-full max-w-sm items-center gap-2">
      <label className="text-sm font-medium" htmlFor="indicator-select">
        Indikaattori
      </label>
      <Select
        value={String(value)}
        onValueChange={(v) => onChange(Number(v))}
        disabled={isDisabled}
      >
        <SelectTrigger id="indicator-select" className="w-[22rem]">
          <SelectValue placeholder="Valitse" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {options.map((opt) => (
            <SelectItem key={opt.id} value={String(opt.id)} className="rounded-lg">
              {opt.titleFi}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

