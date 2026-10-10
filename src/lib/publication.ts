export const welcomeStorySlug = "welcome-to-low-voltage-canada";

/**
 * Through the end of October 2026, the Welcome story stays pinned as "The Big Picture" hero.
 * After October ends (November 1, 2026 onwards), whatever article is posted most recently
 * automatically takes the hero slot.
 */
export const welcomeLeadUntil = new Date("2026-11-01T00:00:00-04:00");

export const communityLinks = [
  {
    label: "Follow on LinkedIn",
    href: "https://www.linkedin.com/company/143923307/",
  },
  {
    label: "Join the LinkedIn group",
    href: "https://www.linkedin.com/groups/18411050/",
  },
] as const;
