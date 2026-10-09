import { defineField, defineType } from "sanity";
import { provinceOptions } from "./shared";

export const organization = defineType({
  name: "organization",
  title: "Organizations",
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
    defineField({
      name: "type",
      title: "Organization type",
      type: "string",
      options: {
        list: [
          { title: "Manufacturer", value: "manufacturer" },
          { title: "Integrator", value: "integrator" },
          { title: "Company", value: "company" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "province",
      title: "Province or territory",
      type: "string",
      options: { list: provinceOptions },
    }),
  ],
  preview: { select: { title: "name", subtitle: "type", media: "logo" } },
});
