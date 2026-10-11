import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../data/plans.js", import.meta.url), "utf8");
const context = { window: {} };
vm.runInNewContext(source, context, { timeout: 1000 });
const book = context.window.PLAN_BOOK;
const errors = [];
const fail = message => errors.push(message);
const arr = value => Array.isArray(value) ? value : [];
const num = value => typeof value === "number" && Number.isFinite(value) ? value : null;
const statuses = new Set(["draft", "ready", "archived"]);
const biases = new Set(["bullish", "bearish", "neutral", "conditional", "mixed"]);
const impacts = new Set(["high", "medium", "low"]);

if (!book || book.version !== 2) fail("data/plans.js must define PLAN_BOOK version 2.");
if (!book || !Array.isArray(book.plans)) fail("PLAN_BOOK.plans must be an array.");

const seenDates = new Set();
for (const [index, plan] of arr(book?.plans).entries()) {
  const prefix = "plans[" + index + "]";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(plan.date || "")) fail(prefix + ": date must use YYYY-MM-DD.");
  if (seenDates.has(plan.date)) fail(prefix + ": duplicate date " + plan.date + ".");
  seenDates.add(plan.date);
  if (!statuses.has(plan.status)) fail(prefix + ": invalid status.");
  if (!biases.has(plan.bias)) fail(prefix + ": invalid bias.");
  if (!Array.isArray(plan.assets)) fail(prefix + ": assets must be an array.");

  for (const [assetIndex, asset] of arr(plan.assets).entries()) {
    const assetPrefix = prefix + ".assets[" + assetIndex + "]";
    if (!asset.symbol) fail(assetPrefix + ": symbol is required.");
    const timeframes = new Set();
    for (const [chartIndex, chart] of arr(asset.charts).entries()) {
      const chartPrefix = assetPrefix + ".charts[" + chartIndex + "]";
      if (!chart.timeframe) fail(chartPrefix + ": timeframe is required.");
      if (timeframes.has(chart.timeframe)) fail(chartPrefix + ": timeframe must be unique per asset.");
      timeframes.add(chart.timeframe);
      let previous = -Infinity;
      for (const [candleIndex, candle] of arr(chart.candles).entries()) {
        const candlePrefix = chartPrefix + ".candles[" + candleIndex + "]";
        const time = typeof candle.time === "number" ? candle.time : Date.parse(candle.time);
        if (!Number.isFinite(time)) fail(candlePrefix + ": invalid time.");
        if (time <= previous) fail(candlePrefix + ": candle times must be strictly ascending and unique.");
        previous = time;
        const o = num(candle.open), h = num(candle.high), l = num(candle.low), c = num(candle.close);
        if ([o, h, l, c].some(value => value === null)) fail(candlePrefix + ": OHLC values must be finite numbers.");
        else if (h < Math.max(o, l, c) || l > Math.min(o, h, c)) fail(candlePrefix + ": inconsistent OHLC range.");
      }
      for (const marker of arr(chart.markers)) {
        if (!arr(chart.candles).some(candle => String(candle.time) === String(marker.time))) {
          fail(chartPrefix + ": marker time must match a candle time.");
        }
      }
    }
    for (const level of arr(asset.levels)) {
      if (!level.name || level.price === undefined || level.price === null) fail(assetPrefix + ": each level needs name and price.");
    }
  }

  for (const [scenarioIndex, scenario] of arr(plan.scenarios).entries()) {
    const scenarioPrefix = prefix + ".scenarios[" + scenarioIndex + "]";
    if (!scenario.name) fail(scenarioPrefix + ": name is required.");
    if (!["bullish", "bearish", "neutral"].includes(scenario.direction)) fail(scenarioPrefix + ": invalid direction.");
    if (!String(scenario.trigger || "").trim()) fail(scenarioPrefix + ": trigger is required.");
    if (!String(scenario.invalidation || "").trim()) fail(scenarioPrefix + ": invalidation is required.");
  }

  for (const event of arr(plan.events)) {
    if (event.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(event.time)) fail(prefix + ": event time must use HH:MM.");
    if (event.impact && !impacts.has(event.impact)) fail(prefix + ": invalid event impact.");
  }
}

if (errors.length) {
  console.error("PLAN data validation failed:");
  for (const error of errors) console.error(" - " + error);
  process.exitCode = 1;
} else {
  console.log("PLAN data validation passed. " + arr(book.plans).length + " daily plan(s) checked.");
}
