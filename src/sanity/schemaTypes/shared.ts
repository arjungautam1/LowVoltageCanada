import { storyKinds, topics } from "../../lib/types";

export const kindOptions = storyKinds.map((kind) => ({
  title: kind,
  value: kind,
}));
export const topicOptions = topics.map((topic) => ({
  title: topic.name,
  value: topic.name,
}));

export const provinceOptions = [
  { title: "Across Canada", value: "Canada" },
  { title: "Alberta", value: "Alberta" },
  { title: "British Columbia", value: "British Columbia" },
  { title: "Manitoba", value: "Manitoba" },
  { title: "New Brunswick", value: "New Brunswick" },
  { title: "Newfoundland and Labrador", value: "Newfoundland and Labrador" },
  { title: "Northwest Territories", value: "Northwest Territories" },
  { title: "Nova Scotia", value: "Nova Scotia" },
  { title: "Nunavut", value: "Nunavut" },
  { title: "Ontario", value: "Ontario" },
  { title: "Prince Edward Island", value: "Prince Edward Island" },
  { title: "Quebec", value: "Quebec" },
  { title: "Saskatchewan", value: "Saskatchewan" },
  { title: "Yukon", value: "Yukon" },
];
