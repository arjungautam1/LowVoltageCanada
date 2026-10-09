import { defineArrayMember, defineField, defineType } from "sanity";
import { kindOptions, provinceOptions, topicOptions } from "./shared";

export const article = defineType({
  name: "article",
  title: "Articles",
  type: "document",
  groups: [
    { name: "story", title: "Story", default: true },
    { name: "publishing", title: "Publishing" },
    { name: "relationships", title: "Related coverage" },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      group: "story",
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "publishing",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Standfirst",
      description: "A short summary shown in cards and search results.",
      type: "text",
      rows: 3,
      group: "story",
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: "kind",
      title: "Story type",
      type: "string",
      options: { list: kindOptions },
      group: "publishing",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "topic",
      title: "Industry",
      type: "string",
      options: { list: topicOptions },
      group: "publishing",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Lead image",
      type: "image",
      group: "story",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          description:
            "Describe the image for readers using assistive technology.",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      group: "publishing",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publication date",
      type: "datetime",
      group: "publishing",
      description:
        "Stories appear on the site after this time and after being published.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Editorial update date",
      type: "datetime",
      group: "publishing",
      description:
        "Optional. Set this when the reporting changes significantly; minor formatting edits do not need a new date.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const publishedAt = context.document?.publishedAt;
          if (
            value &&
            typeof publishedAt === "string" &&
            new Date(value).getTime() < new Date(publishedAt).getTime()
          ) {
            return "The update date must be on or after the publication date.";
          }
          if (value && new Date(value).getTime() > Date.now()) {
            return "Use the actual editorial update time, rather than a future date.";
          }
          return true;
        }),
    }),
    defineField({
      name: "readTime",
      title: "Reading time (minutes)",
      type: "number",
      group: "publishing",
      initialValue: 4,
      validation: (rule) => rule.required().integer().min(1).max(60),
    }),
    defineField({
      name: "featured",
      title: "Feature on the home page",
      type: "boolean",
      group: "publishing",
      initialValue: false,
    }),
    defineField({
      name: "province",
      title: "Province or territory",
      type: "string",
      group: "publishing",
      options: { list: provinceOptions },
    }),
    defineField({
      name: "body",
      title: "Article body",
      type: "array",
      group: "story",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (rule) =>
                      rule
                        .required()
                        .uri({ scheme: ["http", "https", "mailto"] }),
                  }),
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "Search title",
      type: "string",
      group: "seo",
      description:
        "Optional. The headline is used by default. Describe the story clearly; avoid repeated keywords.",
      validation: (rule) =>
        rule
          .max(70)
          .warning("A concise title is easier to scan in search results."),
    }),
    defineField({
      name: "seoDescription",
      title: "Search description",
      type: "text",
      rows: 3,
      group: "seo",
      description:
        "Optional. The standfirst is used by default. Give readers an accurate reason to read the story.",
      validation: (rule) =>
        rule
          .max(180)
          .warning("A short, specific description is easier to scan."),
    }),
    defineField({
      name: "socialImage",
      title: "Sharing image",
      type: "image",
      group: "seo",
      options: { hotspot: true },
      description:
        "Optional. The lead image is used by default. A landscape image with a 1200 × 630 crop works well for sharing.",
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          description:
            "Briefly describe the image; the headline is used if left blank.",
        }),
      ],
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      group: "seo",
      initialValue: false,
      description:
        "The published story remains accessible on the website, but search engines are asked not to index it and it is omitted from sitemaps.",
    }),
    defineField({
      name: "organizations",
      title: "Organizations covered",
      type: "array",
      group: "relationships",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "organization" }],
        }),
      ],
    }),
    defineField({
      name: "people",
      title: "People covered",
      type: "array",
      group: "relationships",
      of: [defineArrayMember({ type: "reference", to: [{ type: "person" }] })],
    }),
    defineField({
      name: "events",
      title: "Events covered",
      type: "array",
      group: "relationships",
      of: [defineArrayMember({ type: "reference", to: [{ type: "event" }] })],
    }),
  ],
  initialValue: () => ({
    publishedAt: new Date().toISOString(),
    readTime: 4,
    featured: false,
  }),
  preview: {
    select: { title: "title", subtitle: "kind", media: "mainImage" },
  },
});
