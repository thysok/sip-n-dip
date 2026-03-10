import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export function useStorageUrl(storageId: Id<"_storage"> | undefined | null) {
  return useQuery(
    api.files.getUrl,
    storageId ? { storageId } : "skip"
  );
}
