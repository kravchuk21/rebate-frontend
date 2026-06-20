"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { Typography, Card } from "@heroui/react";
import { useTranslations } from "next-intl";

interface StatItem {
  value: string;
  label: string;
}

interface ParsedValue {
  prefix: string;
  target: number;
  decimals: number;
  useGrouping: boolean;
  suffix: string;
}

const parseValue = (value: string): ParsedValue => {
  const match = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
  if (!match) {
    return { prefix: "", target: 0, decimals: 0, useGrouping: false, suffix: value };
  }

  const [, prefix, numStr, suffix] = match;
  const useGrouping = numStr.includes(",");
  const normalized = numStr.replace(/,/g, "");
  const dotIndex = normalized.indexOf(".");
  const decimals = dotIndex === -1 ? 0 : normalized.length - dotIndex - 1;

  return { prefix, target: Number(normalized), decimals, useGrouping, suffix };
};

const AnimatedValue = ({ value }: { value: string }) => {
  const { prefix, target, decimals, useGrouping, suffix } = parseValue(value);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();

  const count = useMotionValue(0);
  const formatted = useTransform(count, (latest) =>
    latest.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping,
    }),
  );

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      count.set(target);
      return;
    }

    const controls = animate(count, target, { duration: 2, ease: "easeOut" });
    return () => controls.stop();
  }, [isInView, prefersReducedMotion, count, target]);

  return (
    <span ref={ref}>
      {prefix}
      <motion.span>{formatted}</motion.span>
      {suffix}
    </span>
  );
};

export const LandingStats = () => {
  const t = useTranslations("landing");
  const items = t.raw("stats.items") as StatItem[];

  return (
    <Card className="grid grid-cols-2 gap-8 md:grid-cols-4 items-center">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <Typography.Heading className="text-3xl font-extrabold tracking-tight text-center">
            <AnimatedValue value={item.value} />
          </Typography.Heading>
          <Typography.Paragraph color="muted" size="sm" className="text-center">
            {item.label}
          </Typography.Paragraph>
        </div>
      ))}
    </Card>
  );
};
