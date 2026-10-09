import { defineField, defineType } from "sanity";

export const person = defineType({
  name: "person",
  title: "People",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "jobTitle", title: "Job title", type: "string" }),
    defineField({
      name: "organization",
      title: "Organization",
      type: "reference",
      to: [{ type: "organization" }],
    }),
    defineField({ name: "bio", title: "Biography", type: "text", rows: 4 }),
    defineField({
      name: "image",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: { select: { title: "name", subtitle: "jobTitle", media: "image" } },
});
