import type { PortableTextBlock } from "@portabletext/types";

export type StoryKind =
  "Products" | "People" | "Companies" | "Integrators" | "Events" | "Insights";
export type TopicName =
  "AV & Collaboration" | "Security" | "Networking" | "Smart Buildings";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  kind: StoryKind;
  topic: TopicName;
  image: string;
  imageAlt: string;
  author: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
  province?: string;
  body: PortableTextBlock[];
  isDemo?: boolean;
}

export const storyKinds: StoryKind[] = [
  "Products",
  "People",
  "Companies",
  "Integrators",
  "Events",
  "Insights",
];
export const topics: { name: TopicName; slug: string; description: string }[] =
  [
    {
      name: "AV & Collaboration",
      slug: "av-collaboration",
      description:
        "The technology bringing people, spaces, and experiences together.",
    },
    {
      name: "Security",
      slug: "security",
      description:
        "A clear view of the systems protecting Canada's people and places.",
    },
    {
      name: "Networking",
      slug: "networking",
      description: "The infrastructure behind a more connected Canada.",
    },
    {
      name: "Smart Buildings",
      slug: "smart-buildings",
      description: "Where intelligent technology meets the built environment.",
    },
  ];
