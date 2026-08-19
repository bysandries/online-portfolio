import { collection, config, fields } from "@keystatic/core";

/**
 * Local mode is the default: the admin at /keystatic edits real files in this
 * repo (dev only) — commit + push to publish. Set KEYSTATIC_STORAGE=github
 * (plus the Keystatic GitHub App env vars) to enable the hosted admin.
 * Heads-up: GitHub mode has an open Next 16 bug (keystatic#1549) — verify on
 * a preview deployment before enabling in production.
 */
export default config({
  storage:
    process.env.KEYSTATIC_STORAGE === "github"
      ? { kind: "github", repo: "bysandries/online-portfolio" }
      : { kind: "local" },
  ui: {
    brand: { name: "sandries.com" },
  },
  collections: {
    posts: collection({
      label: "Blog Posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["publishedDate"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        publishedDate: fields.date({
          label: "Published date",
          validation: { isRequired: true },
        }),
        summary: fields.text({
          label: "Summary",
          description: "Shown on the blog index and in search/social previews.",
          multiline: true,
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        content: fields.mdx({ label: "Content" }),
      },
    }),
  },
});
