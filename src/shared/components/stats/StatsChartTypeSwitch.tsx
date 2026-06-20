"use client";

import { Switch } from "@heroui/react";

import type { TrendChartType } from "@/shared/components/charts";

import type { StatsTranslator } from "./types";

interface StatsChartTypeSwitchProps {
  t: StatsTranslator;
  value: TrendChartType;
  onChange: (value: TrendChartType) => void;
}

export const StatsChartTypeSwitch = ({ t, value, onChange }: StatsChartTypeSwitchProps) => (
  <Switch
    isSelected={value === "bar"}
    onChange={(isSelected) => onChange(isSelected ? "bar" : "line")}
  >
    <Switch.Content>
      {t(value === "bar" ? "chartType.bar" : "chartType.line")}
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch.Content>
  </Switch>
);
