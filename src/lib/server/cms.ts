import "server-only";
import mongoose, { Schema, type Model, type SchemaDefinition } from "mongoose";
import { collections, getCollection } from "@/lib/cms/collections";
import { allFields, getPath, setPath, stripHtml, validateDoc, type CollectionConfig, type Field } from "@/lib/cms/fields";

function fieldType(field: Field): unknown {
  switch (field.type) {
    case "number":
      return { type: Number };
    case "boolean":
      return { type: Boolean, default: false };
    case "select":
      return field.numeric ? { type: Number } : { type: String, trim: true };
    case "multiselect":
    case "list":
      return [{ type: String, trim: true }];
    case "pairs": {
      const [a, b] = field.keys;
      return [new Schema({ [a.name]: { type: String, trim: true }, [b.name]: { type: String, trim: true } }, { _id: false })];
    }
    case "richtext":
      return { type: String };
    default:
      return { type: String, trim: true };
  }
}

function buildSchema(config: CollectionConfig) {
  let definition: Record<string, unknown> = {
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    publishedAt: { type: String },
  };
  if (config.article) {
    definition.readTime = { type: Number, default: 0 };
    definition.wordCount = { type: Number, default: 0 };
  }
  for (const field of allFields(config)) {
    definition = setPath(definition, field.name, fieldType(field));
    if (field.type === "slug") definition = setPath(definition, field.name, { type: String, trim: true, unique: true, index: true });
  }
  // Articles keep their byline in the document, like the Delhi site's data.
  if (config.key === "blogs" || config.key === "current-affairs" || config.key === "study-plans" || config.key === "toppers-strategy") {
    definition.author = { name: { type: String, trim: true }, role: { type: String, trim: true } };
  }
  return new Schema(definition as SchemaDefinition, { timestamps: true });
}

const models = new Map<string, Model<Record<string, unknown>>>();

export function modelFor(config: CollectionConfig) {
  let model = models.get(config.key);
  if (!model) {
    model = (mongoose.models[config.model] as Model<Record<string, unknown>>) ?? mongoose.model(config.model, buildSchema(config));
    models.set(config.key, model);
  }
  return model;
}

export function resolveCollection(key: string) {
  const config = getCollection(key);
  return config ? { config, model: modelFor(config) } : null;
}

/** Copies only known fields from untrusted input and coerces their types. */
export function normalize(config: CollectionConfig, input: Record<string, unknown>, existing?: Record<string, unknown>) {
  let doc: Record<string, unknown> = { status: input.status === "published" ? "published" : "draft" };

  for (const field of allFields(config)) {
    const raw = getPath(input, field.name);
    let value: unknown;
    switch (field.type) {
      case "number":
        value = raw === "" || raw === null || raw === undefined || Number.isNaN(Number(raw)) ? undefined : Number(raw);
        break;
      case "boolean":
        value = Boolean(raw);
        break;
      case "select":
        value = raw === "" || raw === undefined || raw === null ? undefined : field.numeric ? Number(raw) : String(raw);
        if (value !== undefined && !field.options.some((o) => o.value === String(value))) value = undefined;
        break;
      case "multiselect":
        value = Array.isArray(raw) ? raw.map(String).filter((v) => field.options.some((o) => o.value === v)) : [];
        break;
      case "list":
        value = Array.isArray(raw) ? raw.map((v) => String(v).trim()).filter(Boolean) : [];
        break;
      case "pairs": {
        const [a, b] = field.keys;
        value = Array.isArray(raw)
          ? raw
              .map((row) => ({ [a.name]: String(row?.[a.name] ?? "").trim(), [b.name]: String(row?.[b.name] ?? "").trim() }))
              .filter((row) => row[a.name] || row[b.name])
          : [];
        break;
      }
      case "richtext":
        value = typeof raw === "string" ? raw : "";
        break;
      default:
        value = typeof raw === "string" ? raw.trim() : raw === undefined || raw === null ? "" : String(raw);
    }
    doc = setPath(doc, field.name, value);
  }

  if (config.article) {
    const words = stripHtml(String(doc.content ?? "")).split(" ").filter(Boolean).length;
    doc.wordCount = words;
    doc.readTime = Math.max(1, Math.round(words / 220));
    doc.author = (existing?.author as object | undefined) ?? { name: "Anand Sharma", role: "Academic Lead" };
  }

  // First publish stamps the date; later edits keep it.
  doc.publishedAt =
    (existing?.publishedAt as string | undefined) ||
    (doc.status === "published" ? new Date().toISOString().slice(0, 10) : undefined);

  return { doc, errors: validateDoc(config, doc) };
}

/** Lean documents carry ObjectIds and Dates; this makes them plain JSON for caching and client props. */
export function plain<T>(value: unknown): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function duplicateKeyMessage(error: unknown) {
  if (typeof error === "object" && error && "code" in error && (error as { code: number }).code === 11000) {
    return "Another entry already uses this URL slug.";
  }
  return null;
}

export { collections };
