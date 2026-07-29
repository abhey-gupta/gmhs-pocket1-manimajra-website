/**
 * Supabase Storage is the only home for activity photo packs. Both the public
 * gallery pages and the admin manager read through this module so they can
 * never disagree about where the photos live.
 */
import { supabaseAdmin } from "@/lib/supabase";
import {
  ACTIVITIES_BUCKET,
  ACTIVITIES_ROOT,
  IMAGE_EXT_RE,
  isSafeActivityPath,
  normalizeActivityPath,
} from "@/lib/activity-paths";

export interface ActivityPhoto {
  /** Bucket-relative storage key, e.g. "activities/fit-india/2025-26/YOGA/x.jpg" */
  path: string;
  /** Public CDN url for <img src>. */
  url: string;
}

export interface ActivityPack {
  id: string;
  category: string;
  year: string;
  title: string;
  /** Bucket-relative prefix, e.g. "activities/fit-india/2025-26/YOGA" */
  path: string;
  photos: ActivityPhoto[];
}

const LIST_LIMIT = 1000;

function bucket() {
  return supabaseAdmin.storage.from(ACTIVITIES_BUCKET);
}

export function activityPublicUrl(objectPath: string): string {
  return bucket().getPublicUrl(objectPath).data.publicUrl;
}

interface StorageEntry {
  name: string;
  id: string | null;
}

/** Supabase reports pseudo-directories with a null id and objects with a uuid. */
async function listEntries(prefix: string): Promise<StorageEntry[]> {
  const { data, error } = await bucket().list(prefix, {
    limit: LIST_LIMIT,
    sortBy: { column: "name", order: "asc" },
  });
  if (error) throw new Error(`Storage list failed for "${prefix}": ${error.message}`);
  return (data ?? []) as StorageEntry[];
}

const subfolders = (entries: StorageEntry[]) => entries.filter((e) => !e.id).map((e) => e.name);
const objects = (entries: StorageEntry[]) => entries.filter((e) => !!e.id).map((e) => e.name);

/**
 * Every pack, or only those under one category. Packs with no image files are
 * omitted — Supabase Storage has no real directories, so an "empty folder"
 * simply does not exist.
 */
export async function listActivityPacks(category?: string): Promise<ActivityPack[]> {
  const categories = category ? [category] : subfolders(await listEntries(ACTIVITIES_ROOT));

  const packs: ActivityPack[] = [];
  for (const cat of categories) {
    const years = subfolders(await listEntries(`${ACTIVITIES_ROOT}/${cat}`));
    for (const year of years) {
      const titles = subfolders(await listEntries(`${ACTIVITIES_ROOT}/${cat}/${year}`));
      for (const title of titles) {
        const packPath = `${ACTIVITIES_ROOT}/${cat}/${year}/${title}`;
        const photos = objects(await listEntries(packPath))
          .filter((name) => IMAGE_EXT_RE.test(name))
          .map((name) => {
            const path = `${packPath}/${name}`;
            return { path, url: activityPublicUrl(path) };
          });

        packs.push({
          id: `${cat}|${year}|${title}`,
          category: cat,
          year,
          title,
          path: packPath,
          photos,
        });
      }
    }
  }
  return packs;
}

function assertSafe(input: string, label: string): string {
  if (!input || !isSafeActivityPath(input)) {
    throw new ActivityStorageError(`Invalid ${label}: must be inside "${ACTIVITIES_ROOT}/"`);
  }
  return normalizeActivityPath(input);
}

/** Thrown for caller mistakes (bad path, name clash) — maps to a 400. */
export class ActivityStorageError extends Error {}

/** True when at least one object exists under the prefix. */
export async function activityPackExists(packPath: string): Promise<boolean> {
  const entries = await listEntries(assertSafe(packPath, "pack path"));
  return entries.length > 0;
}

/** Delete every object inside a pack. Returns how many were removed. */
export async function deleteActivityPack(packPath: string): Promise<number> {
  const prefix = assertSafe(packPath, "pack path");
  const names = objects(await listEntries(prefix));
  if (names.length === 0) return 0;

  const { error } = await bucket().remove(names.map((name) => `${prefix}/${name}`));
  if (error) throw new Error(`Failed to delete activity pack: ${error.message}`);
  return names.length;
}

export async function deleteActivityPhoto(photoPath: string): Promise<void> {
  const path = assertSafe(photoPath, "photo path");
  const { error } = await bucket().remove([path]);
  if (error) throw new Error(`Failed to delete photo: ${error.message}`);
}

/**
 * Move a pack to a new category/year/title by moving each object. Storage has
 * no folder rename, so this is inherently per-object; it stops at the first
 * failure, leaving already-moved files at the destination.
 */
export async function moveActivityPack(fromPath: string, toPath: string): Promise<number> {
  const from = assertSafe(fromPath, "source path");
  const to = assertSafe(toPath, "destination path");

  if (from === to) return 0;

  const names = objects(await listEntries(from));
  if (names.length === 0) {
    throw new ActivityStorageError("Source activity pack does not exist or has no photos");
  }
  if (await activityPackExists(to)) {
    throw new ActivityStorageError("An activity with that name already exists in the selected session");
  }

  for (const name of names) {
    const { error } = await bucket().move(`${from}/${name}`, `${to}/${name}`);
    if (error) throw new Error(`Failed to move "${name}": ${error.message}`);
  }
  return names.length;
}
