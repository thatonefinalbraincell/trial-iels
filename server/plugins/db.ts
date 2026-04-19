// NOTE: with D1 on Cloudflare Pages the DB is provided as a per-request binding
// (event.context.cloudflare.env.ielts_db). There is nothing to "init" at server
// startup — no file to open, no schema to apply. Schema is pushed out-of-band
// via `npm run db:schema`.
//
// This plugin is intentionally a no-op, kept only to avoid breaking any future
// imports. Safe to delete.
export default defineNitroPlugin(() => {})
