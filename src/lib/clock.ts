"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/lib/site";

// Current minute as a number, or null during server render so nothing
// time-dependent is baked into the static HTML.
export function useMinute() {
  return useSyncExternalStore(
    (onChange) => {
      const id = setInterval(onChange, 15_000);
      return () => clearInterval(id);
    },
    () => Math.floor(Date.now() / 60_000),
    () => null,
  );
}

function istHour(minute: number) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date(minute * 60_000));
  const h = Number(parts.find((p) => p.type === "hour")?.value);
  const m = Number(parts.find((p) => p.type === "minute")?.value);
  return h + m / 60;
}

export function centreStatus(minute: number) {
  const h = istHour(minute);
  const open = h >= site.opensAt && h < site.closesAt;
  return {
    open,
    short: open ? "Open now" : "Closed",
    long: open ? "Open now · until 7 PM" : h < site.opensAt ? "Closed · opens 10 AM" : "Closed · opens 10 AM tomorrow",
  };
}

export function greeting(minute: number) {
  const h = istHour(minute);
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
