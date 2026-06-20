"use client";

import { Label, ListBox, Select } from "@heroui/react";

import { RANGE_MODES, type RangeMode, type StatsTranslator } from "./types";

interface StatsRangeSelectProps {
  t: StatsTranslator;
  value: RangeMode;
  onChange: (value: RangeMode) => void;
}

export const StatsRangeSelect = ({ t, value, onChange }: StatsRangeSelectProps) => (
  <Select variant="secondary" value={value} onChange={(key) => onChange(key as RangeMode)}>
    <Label className="sr-only">{t("rangeLabel")}</Label>
    <Select.Trigger>
      <Select.Value />
      <Select.Indicator />
    </Select.Trigger>
    <Select.Popover>
      <ListBox>
        {RANGE_MODES.map((mode) => (
          <ListBox.Item key={mode} id={mode} textValue={t(`ranges.${mode}`)}>
            {t(`ranges.${mode}`)}
          </ListBox.Item>
        ))}
      </ListBox>
    </Select.Popover>
  </Select>
);
