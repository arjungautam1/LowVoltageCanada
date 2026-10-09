import { defineField, defineType } from "sanity";
import { provinceOptions, topicOptions } from "./shared";

export const event = defineType({
  name: "event",
  title: "Events",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Event name",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "startsAt",
      title: "Starts",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endsAt",
      title: "Ends",
      type: "datetime",
      validation: (rule) => rule.min(rule.valueOfField("startsAt")),
    }),
    defineField({ name: "venue", title: "Venue", type: "string" }),
    defineField({ name: "city", title: "City", type: "string" }),
    defineField({
      name: "province",
      title: "Province or territory",
      type: "string",
      options: { list: provinceOptions },
    }),
    defineField({
      name: "topic",
      title: "Industry",
      type: "string",
      options: { list: topicOptions },
    }),
    defineField({
      name: "website",
      title: "Event website",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "organizer",
      title: "Organizer",
      type: "reference",
      to: [{ type: "organization" }],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: { select: { title: "name", subtitle: "city", media: "image" } },
});
