import "server-only";
import { createHash } from "crypto";
import { ENQUIRY_SOURCES } from "@/lib/cms/enquiries";
import { Enquiry } from "./enquiry-model";

// Everything here runs on untrusted input from the public enquiry endpoint.

const LIMITS = { name: 100, phone: 20, email: 160, city: 80, stage: 40, programInterest: 120, message: 2000, pageUrl: 500 };

/** A human needs at least this long to fill the form. */
const MIN_FILL_MS = 2500;
const MAX_PER_IP = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;

export type CleanEnquiry = {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  stage?: string;
  programInterest?: string;
  message?: string;
  source: string;
  pageUrl?: string;
};

type Result = { ok: true; data: CleanEnquiry } | { ok: false; reason: string; silent: boolean };

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max);
}

/** Indian mobile numbers, tolerating +91 or 0 prefixes, spaces and dashes. */
function normalisePhone(raw: string) {
  const local = raw.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(local) ? local : null;
}

function looksLikeSpam(text: string) {
  if (!text) return false;
  if ((text.match(/https?:\/\//gi) || []).length >= 2) return true;
  if (/\[url=|<a\s+href|\[link=/i.test(text)) return true;
  return /\b(crypto|bitcoin|forex|casino|viagra|cialis|porn|escort|seo services|backlinks?)\b/i.test(text);
}

export function validateEnquiry(body: Record<string, unknown>): Result {
  // Honeypot field, hidden from people.
  if (clean(body.company, 100)) return { ok: false, reason: "honeypot", silent: true };

  const loadedAt = Number(body.formLoadedAt) || 0;
  if (loadedAt > 0) {
    const elapsed = Date.now() - loadedAt;
    if (elapsed >= 0 && elapsed < MIN_FILL_MS) return { ok: false, reason: "too-fast", silent: true };
  }

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const message = clean(body.message, LIMITS.message);

  if (name.length < 2 || !/[a-zऀ-ॿ]/i.test(name)) {
    return { ok: false, reason: "Please enter the student's name", silent: false };
  }
  const phone = normalisePhone(clean(body.phone, LIMITS.phone));
  if (!phone) return { ok: false, reason: "Please enter a valid 10-digit mobile number", silent: false };
  if (email && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) {
    return { ok: false, reason: "Please enter a valid email address", silent: false };
  }
  if (looksLikeSpam(message) || looksLikeSpam(name)) return { ok: false, reason: "spam", silent: true };

  const source = clean(body.source, 40);
  return {
    ok: true,
    data: {
      name,
      phone,
      email: email || undefined,
      city: clean(body.city, LIMITS.city) || undefined,
      stage: clean(body.stage, LIMITS.stage) || undefined,
      programInterest: clean(body.programInterest, LIMITS.programInterest) || undefined,
      message: message || undefined,
      source: (ENQUIRY_SOURCES as readonly string[]).includes(source) ? source : "other",
      pageUrl: clean(body.pageUrl, LIMITS.pageUrl) || undefined,
    },
  };
}

export function hashClientIp(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "";
  if (!ip) return "";
  const salt = process.env.JWT_SECRET || "lpt-noida-enquiry";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

/**
 * Blocks floods from one IP and instant duplicates of the same phone number.
 * Fails open: losing a real student's enquiry is worse than letting a bot through.
 */
export async function isRateLimited(ipHash: string, phone: string) {
  try {
    if (ipHash) {
      const recent = await Enquiry.countDocuments({ ipHash, createdAt: { $gte: new Date(Date.now() - RATE_WINDOW_MS) } });
      if (recent >= MAX_PER_IP) return true;
    }
    const duplicate = await Enquiry.exists({ phone, createdAt: { $gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) } });
    return Boolean(duplicate);
  } catch (error) {
    console.error("[enquiries] Rate-limit check failed, allowing through:", error);
    return false;
  }
}
