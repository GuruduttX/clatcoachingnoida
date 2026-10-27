// Deterministic formatting for stored yyyy-mm-dd strings. No "now" involved,
// so it is safe during prerendering.
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function parseIsoDate(value: unknown) {
  const m = typeof value === "string" ? /^(\d{4})-(\d{2})-(\d{2})/.exec(value) : null;
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const weekday = DAYS[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()];
  return { year: y, month: mo, day: d, monthName: MONTHS[mo - 1], monthShort: MONTHS[mo - 1].slice(0, 3), weekday };
}

export function formatIsoDate(value: unknown) {
  const d = parseIsoDate(value);
  return d ? `${d.day} ${d.monthName} ${d.year}` : null;
}
