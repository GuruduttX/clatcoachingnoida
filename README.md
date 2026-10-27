# LawPrep Tutorial Noida (clatcoachingnoida.com)

Sibling site of `LPT_delhi`. Next.js 16 with Cache Components, Tailwind 4, MongoDB (database `CLAT_NOIDA`), Cloudinary for images, Resend for enquiry emails.

```bash
npm run dev          # http://localhost:3000
npm run build
npm run copy:lpt     # copy shared reviews from the LPT_DELHI database (safe to re-run)
```

`npm run copy:lpt -- --with nlu-profiles,study-plans` also copies those collections **as drafts**, so nothing duplicates the Delhi site until it's been reviewed in the admin. Add `--dry-run` to preview.

## Environment

Same keys as LPT Delhi: `MONGODB_URI` (must point at `CLAT_NOIDA`), `CLOUDINARY_*`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`, `ENQUIRY_ACCESS_CODE`, `RESEND_API_KEY`, `ENQUIRY_NOTIFY_FROM`, `ENQUIRY_NOTIFY_TO`, `NEXT_PUBLIC_URL`.
Optional: `ENQUIRY_EMAIL_ENABLED=false` stops notification emails; `ENQUIRY_EMAIL_DAILY_CAP` (default 40, since the Resend account is shared with Delhi).

## Admin

`/admin-login`, then `/admin`. Sections: Blogs, Current Affairs, NLU Profiles, Toppers' Strategy, Study Plans, FAQs, Reviews, Batches, and Enquiries (which also needs the 4-digit access code).

Every section is described once in `src/lib/cms/collections.ts`. That config generates the admin form, the list screen, the Mongoose schema (`src/lib/server/cms.ts`) and validation. To add a field, add it to the config; to add a section, add a config entry, then write its public page.

- Drafts need only a title (and slug). Fields marked `required` must be filled to publish.
- Saving calls `revalidateTag(<section>)`, so the public pages update on the next visit.
- Every `/api/admin/*` route checks the admin session itself; `src/proxy.ts` only guards the admin pages.
- Uploads go to Cloudinary under `CLAT_NOIDA/<section>`.

## Where content lives

| What | Where |
|---|---|
| Contact details, address, navigation | `src/lib/site.ts` |
| Courses, CLAT 2026 Noida toppers, centre photos | `src/lib/data.ts` |
| Faculty (same as Delhi) | `src/lib/faculty.ts` |
| Gallery photo lists | `src/lib/gallery.ts` |
| Everything editable by staff | the admin (MongoDB) |
