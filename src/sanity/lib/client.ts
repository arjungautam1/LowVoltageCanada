import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

// Leave the site in clearly labelled demo mode until the existing project is connected.
export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;
