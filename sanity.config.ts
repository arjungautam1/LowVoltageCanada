"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";

export default defineConfig({
  name: "low-voltage-canada",
  title: "Low Voltage Canada",
  basePath: "/studio",
  // Studio is mounted only when a project ID exists. The inert placeholder lets
  // the configuration module load safely during the initial demo build.
  projectId: projectId || "unconfigured",
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
