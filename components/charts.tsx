"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const GOLD = "#E3B341";
const GRID = "rgba(255,255,255,0.08)";
const AXIS = "#9CA0A6";

export function SkillRadarChart({
  data,
}: {
  data: { skill: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke={GRID} />
        <PolarAngleAxis dataKey="skill" tick={{ fill: AXIS, fontSize: 11 }} />
        <Radar name="Score" dataKey="value" stroke={GOLD} fill={GOLD} fillOpacity={0.25} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function PaceLineChart({ data }: { data: { t: string; wpm: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="t" tick={{ fill: AXIS, fontSize: 11 }} axisLine={{ stroke: GRID }} tickLine={false} />
        <YAxis tick={{ fill: AXIS, fontSize: 11 }} axisLine={{ stroke: GRID }} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#1C1C1F", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#F5F3EE" }}
        />
        <Line type="monotone" dataKey="wpm" stroke={GOLD} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ScoreCategoryBars({ data }: { data: { label: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fill: AXIS, fontSize: 11 }} axisLine={{ stroke: GRID }} tickLine={false} />
        <YAxis type="category" dataKey="label" tick={{ fill: AXIS, fontSize: 12 }} axisLine={false} tickLine={false} width={140} />
        <Tooltip
          contentStyle={{ background: "#1C1C1F", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#F5F3EE" }}
        />
        <Bar dataKey="value" fill={GOLD} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
