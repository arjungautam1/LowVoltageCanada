import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Authors",
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
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "bio", title: "Biography", type: "text", rows: 4 }),
    defineField({
      name: "image",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});
