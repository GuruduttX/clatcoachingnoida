// Field and collection descriptions for the CMS. One config drives the admin
// form, the list screen, the Mongoose schema and server-side validation, so
// they can't drift apart. Client-safe: no server imports here.

export type Option = { value: string; label: string };

type Base = {
  /** Dot path into the document, e.g. "meta.title" or "heroImage.url". */
  name: string;
  label: string;
  help?: string;
  placeholder?: string;
  /** Required before the entry can be published (title and slug are always required). */
  required?: boolean;
  /** Spans both columns of the form grid on desktop. */
  wide?: boolean;
};

export type Field =
  | (Base & { type: "text"; maxLength?: number })
  | (Base & { type: "slug"; from: string })
  | (Base & { type: "textarea"; rows?: number; maxLength?: number })
  | (Base & { type: "richtext" })
  | (Base & { type: "image"; folder: string })
  | (Base & { type: "select"; options: Option[]; numeric?: boolean })
  | (Base & { type: "multiselect"; options: Option[] })
  | (Base & { type: "number"; min?: number; max?: number })
  | (Base & { type: "date" })
  | (Base & { type: "boolean" })
  | (Base & { type: "list"; itemLabel?: string })
  | (Base & {
      type: "pairs";
      itemLabel: string;
      keys: [PairKey, PairKey];
    });

export type PairKey = { name: string; label: string; multiline?: boolean; placeholder?: string };

export type Section = { title: string; description?: string; fields: Field[] };

export type CollectionKey =
  | "blogs"
  | "current-affairs"
  | "nlu-profiles"
  | "toppers-strategy"
  | "study-plans"
  | "faqs"
  | "reviews"
  | "batches";

export type CollectionConfig = {
  key: CollectionKey;
  label: string;
  singular: string;
  /** Mongoose model name; its pluralised form is the MongoDB collection (shared with LPT Delhi's naming). */
  model: string;
  description: string;
  titleField: string;
  /** Short line under the title in admin lists. */
  subtitle?: (doc: Record<string, unknown>) => string;
  imageField?: string;
  /** Field used to group/filter the admin list. */
  filterField?: { name: string; label: string; options: Option[] };
  sort: Record<string, 1 | -1>;
  /** Fills readTime and wordCount from the rich-text `content` field. */
  article?: boolean;
  publicPath?: (doc: Record<string, unknown>) => string | null;
  sections: Section[];
};

export const opts = (values: readonly string[]): Option[] => values.map((v) => ({ value: v, label: v }));

export function allFields(config: CollectionConfig) {
  return config.sections.flatMap((s) => s.fields);
}

export function getPath(doc: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => (value as Record<string, unknown> | undefined)?.[key], doc);
}

export function setPath<T extends Record<string, unknown>>(doc: T, path: string, value: unknown): T {
  const [head, ...rest] = path.split(".");
  if (rest.length === 0) return { ...doc, [head]: value };
  const child = (doc[head] as Record<string, unknown> | undefined) ?? {};
  return { ...doc, [head]: setPath(child, rest.join("."), value) };
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function isEmpty(value: unknown) {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim() === "" || value.trim() === "<p></p>";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/** Problems that block saving (always) or publishing (required fields). */
export function validateDoc(config: CollectionConfig, doc: Record<string, unknown>) {
  const errors: Record<string, string> = {};
  const publishing = doc.status === "published";
  for (const field of allFields(config)) {
    const value = getPath(doc, field.name);
    const always = field.name === config.titleField || field.type === "slug";
    if ((always || (publishing && field.required)) && isEmpty(value)) {
      errors[field.name] = always ? "Required" : "Required to publish";
    }
    if (field.type === "slug" && typeof value === "string" && value && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      errors[field.name] = "Use lowercase letters, numbers and hyphens";
    }
    if (field.type === "number" && value !== undefined && value !== null && value !== "") {
      const n = Number(value);
      if (Number.isNaN(n)) errors[field.name] = "Must be a number";
      else if (field.min !== undefined && n < field.min) errors[field.name] = `At least ${field.min}`;
      else if (field.max !== undefined && n > field.max) errors[field.name] = `At most ${field.max}`;
    }
  }
  return errors;
}

/** Plain text of an HTML string, for word counts and excerpts. */
export function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&[a-z#0-9]+;/gi, "'").replace(/\s+/g, " ").trim();
}
