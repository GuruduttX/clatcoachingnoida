import "server-only";
import { Resend } from "resend";
import { ENQUIRY_SOURCE_LABELS } from "@/lib/cms/enquiries";
import { Enquiry } from "./enquiry-model";

type EnquiryPayload = {
  _id?: unknown;
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  stage?: string;
  programInterest?: string;
  message?: string;
  source?: string;
  pageUrl?: string;
  createdAt?: Date | string;
};

/**
 * Kept under Resend's free-tier limit of 100/day so a traffic spike can never
 * use up the quota. Both sites share the account, so this cap is lower than
 * the Delhi site's.
 */
const DAILY_SEND_CAP = Number(process.env.ENQUIRY_EMAIL_DAILY_CAP) || 40;

// Hex copies of the theme tokens in globals.css; email clients can't read CSS variables.
const C = {
  brand: "#e40014",
  sun: "#fcc419",
  sunTint: "#fff6d6",
  ink: "#141210",
  ink2: "#55514a",
  ink3: "#7a756c",
  line: "#e7e5df",
  mist: "#f5f4f1",
};
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

let client: Resend | null = null;
function getClient() {
  if (!process.env.RESEND_API_KEY) return null;
  return (client ??= new Resend(process.env.RESEND_API_KEY));
}

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const when = (value?: Date | string) =>
  new Date(value ?? Date.now()).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

function adminUrl() {
  const base = process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "");
  return base ? `${base}/admin/enquiries` : null;
}

function buildHtml(e: EnquiryPayload) {
  const link = (href: string, text: string) =>
    `<a href="${esc(href)}" style="color:${C.brand};font-weight:700;text-decoration:none;">${esc(text)}</a>`;
  const rows: [string, string][] = [];
  const add = (label: string, value?: string, html?: string) => value && rows.push([label, html ?? esc(value)]);

  add("Name", e.name);
  add("Phone", e.phone, e.phone && link(`tel:+91${e.phone}`, e.phone));
  add("Email", e.email, e.email && link(`mailto:${e.email}`, e.email));
  add("Currently in", e.stage);
  add("Interested in", e.programInterest);
  add("City", e.city);
  add("Received", when(e.createdAt));
  add("Page", e.pageUrl, e.pageUrl && link(e.pageUrl, e.pageUrl.replace(/^https?:\/\//, "")));

  const source = ENQUIRY_SOURCE_LABELS[e.source ?? "other"] ?? "Website";
  const admin = adminUrl();
  const table = rows
    .map(
      ([label, value], i) =>
        `<tr><td style="padding:11px 16px 11px 24px;${i ? `border-top:1px solid ${C.line};` : ""}color:${C.ink3};font:600 12px ${FONT};white-space:nowrap;vertical-align:top;width:120px;">${label}</td><td style="padding:11px 24px 11px 0;${i ? `border-top:1px solid ${C.line};` : ""}color:${C.ink};font:500 15px ${FONT};">${value}</td></tr>`,
    )
    .join("");

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New enquiry</title></head>
<body style="margin:0;background:${C.mist};">
<div style="display:none;max-height:0;overflow:hidden;">${esc(e.name ?? "New enquiry")} · ${esc(e.phone ?? "")} · ${esc(source)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.mist};"><tr><td align="center" style="padding:28px 14px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#fff;border-radius:22px;overflow:hidden;">
<tr><td style="background:${C.brand};padding:24px;">
<div style="color:#fff;opacity:.8;font:700 12px ${FONT};letter-spacing:.12em;text-transform:uppercase;">LawPrep Tutorial · Noida</div>
<div style="color:#fff;font:800 24px ${FONT};padding-top:6px;">New enquiry</div></td></tr>
<tr><td style="padding:20px 24px 4px;"><span style="background:${C.sun};color:${C.ink};font:700 12px ${FONT};padding:6px 12px;border-radius:99px;">${esc(source)}</span></td></tr>
<tr><td style="padding:10px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${table}</table></td></tr>
${
  e.message
    ? `<tr><td style="padding:0 24px 20px;"><div style="background:${C.sunTint};border-radius:14px;padding:14px 16px;color:${C.ink2};font:400 15px/1.6 ${FONT};">${esc(e.message).replace(/\n/g, "<br>")}</div></td></tr>`
    : ""
}
<tr><td style="padding:0 24px 24px;">
${e.phone ? `<a href="tel:+91${esc(e.phone)}" style="display:inline-block;background:${C.brand};color:#fff;font:700 14px ${FONT};padding:12px 22px;border-radius:99px;text-decoration:none;margin-right:8px;">Call ${esc(e.name ?? "student")}</a>` : ""}
${admin ? `<a href="${admin}" style="display:inline-block;background:${C.ink};color:#fff;font:700 14px ${FONT};padding:12px 22px;border-radius:99px;text-decoration:none;">Open in admin</a>` : ""}
</td></tr>
<tr><td style="background:${C.mist};padding:16px 24px;color:${C.ink3};font:500 12px ${FONT};">Automated notification from the LawPrep Noida website.</td></tr>
</table></td></tr></table></body></html>`;
}

function buildText(e: EnquiryPayload) {
  return [
    "New enquiry · LawPrep Tutorial Noida",
    "",
    `Name: ${e.name ?? "-"}`,
    `Phone: ${e.phone ?? "-"}`,
    `Email: ${e.email ?? "-"}`,
    `Currently in: ${e.stage ?? "-"}`,
    `Interested in: ${e.programInterest ?? "-"}`,
    `City: ${e.city ?? "-"}`,
    `Message: ${e.message ?? "-"}`,
    `Source: ${ENQUIRY_SOURCE_LABELS[e.source ?? "other"] ?? "-"}`,
    `Page: ${e.pageUrl ?? "-"}`,
    `Received: ${when(e.createdAt)}`,
  ].join("\n");
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Emails the team about a saved enquiry. Never throws: mail trouble must not affect the visitor. */
export async function sendEnquiryNotification(enquiry: EnquiryPayload) {
  if (process.env.ENQUIRY_EMAIL_ENABLED === "false") return false;

  const resend = getClient();
  const from = process.env.ENQUIRY_NOTIFY_FROM;
  const to = (process.env.ENQUIRY_NOTIFY_TO ?? "").split(",").map((a) => a.trim()).filter(Boolean);
  if (!resend || !from || to.length === 0) return false;

  try {
    const count = await Enquiry.countDocuments({ notifiedAt: { $gte: startOfToday() } });
    if (count >= DAILY_SEND_CAP) {
      console.warn(`[enquiry-email] Daily cap of ${DAILY_SEND_CAP} reached; skipping.`);
      if (count === DAILY_SEND_CAP) {
        await resend.emails.send({
          from,
          to,
          subject: "Noida enquiry email cap reached. Check the admin panel",
          text: `${count} enquiry emails went out today, which is the daily cap. New enquiries are still being saved: ${adminUrl() ?? "/admin/enquiries"}`,
        });
      }
      return false;
    }
  } catch (error) {
    console.error("[enquiry-email] Cap check failed, sending anyway:", error);
  }

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: enquiry.email || undefined,
      subject: `Noida enquiry · ${enquiry.name ?? "Unknown"} · ${enquiry.programInterest ?? ENQUIRY_SOURCE_LABELS[enquiry.source ?? "other"] ?? "Website"}`,
      html: buildHtml(enquiry),
      text: buildText(enquiry),
    });
    if (error) {
      console.error("[enquiry-email] Resend rejected the message:", error);
      return false;
    }
    if (enquiry._id) {
      await Enquiry.updateOne({ _id: enquiry._id }, { $set: { notifiedAt: new Date() } }).catch((err: unknown) =>
        console.error("[enquiry-email] Couldn't stamp notifiedAt:", err),
      );
    }
    return true;
  } catch (error) {
    console.error("[enquiry-email] Failed to send:", error);
    return false;
  }
}
