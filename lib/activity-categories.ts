/**
 * Single source of truth for activity categories.
 *
 * `slug` is load-bearing in three places that must agree:
 *   - the public route  /activities/<slug>
 *   - the Supabase Storage prefix  activities/<slug>/...
 *   - the admin category dropdowns
 * They previously drifted (admin wrote "ek-bharat-shrestha-bharat" while the
 * page read "ek-bharat-shreshtha-bharat"), which made those uploads invisible.
 */

export interface ActivityCategory {
  slug: string;
  /** Short label for admin UI / badges. */
  label: string;
  /** Longer title used on the homepage and navbar. */
  navTitle: string;
}

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  {
    slug: "samagra-shiksha",
    label: "Samagra Shiksha",
    navTitle: "Samagra Shiksha Activities",
  },
  {
    slug: "pm-poshan",
    label: "PM Poshan",
    navTitle: "PM Poshan Activities",
  },
  {
    slug: "digital-india",
    label: "Digital India",
    navTitle: "Digital India Activities",
  },
  {
    slug: "fit-india",
    label: "FIT India",
    navTitle: "FIT India Activities",
  },
  {
    slug: "ek-bharat-shreshtha-bharat",
    label: "Ek Bharat Shreshtha Bharat",
    navTitle: "Ek Bharat Shreshtha Bharat",
  },
  {
    slug: "swachha-bharat-swachha-vidayalaya",
    label: "Swachha Bharat Swachha Vidyalaya",
    navTitle: "Swachha Bharat Swachha Vidyalaya",
  },
];

export const ACTIVITY_CATEGORY_SLUGS = ACTIVITY_CATEGORIES.map((c) => c.slug);

export function activityCategoryLabel(slug: string): string {
  return ACTIVITY_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
