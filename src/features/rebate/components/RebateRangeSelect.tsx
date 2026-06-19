"use client";

import { Label, ListBox, Select } from "@heroui/react";
import { useTranslations } from "next-intl";

import { RANGE_MODES, type RangeMode } from "../lib/buildTrendChart";

interface RebateRangeSelectProps {
  value: RangeMode;
  onChange: (value: RangeMode) => void;
}

export const RebateRangeSelect = ({ value, onChange }: RebateRangeSelectProps) => {
  const t = useTranslations("rebate.stats");

  return (
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
};
