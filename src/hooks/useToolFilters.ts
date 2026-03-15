import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";

export interface ToolFilters {
  search: string;
  category: string;
  subcategory: string;
  pricing: string;
  tags: string[];
}

type ToolFilterKey = keyof ToolFilters;

export function useToolFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ToolFilters = useMemo(() => ({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    subcategory: searchParams.get("subcategory") || "",
    pricing: searchParams.get("pricing") || "",
    tags: searchParams.getAll("tag"),
  }), [searchParams]);

  const setFilters = useCallback(
    (updates: Partial<ToolFilters>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        const applyValue = (key: ToolFilterKey, value: string | string[]) => {
          if (key === "tags") {
            next.delete("tag");
            (value as string[]).forEach((tag) => next.append("tag", tag));
            return;
          }

          if (!value || (typeof value === "string" && !value.trim())) {
            next.delete(key);
            return;
          }

          next.set(key, value as string);
        };

        for (const [key, value] of Object.entries(updates) as [ToolFilterKey, string | string[]][]) {
          applyValue(key, value);
        }

        if (Object.prototype.hasOwnProperty.call(updates, "category") && !Object.prototype.hasOwnProperty.call(updates, "subcategory")) {
          next.delete("subcategory");
        }

        if (!next.get("category")) {
          next.delete("subcategory");
        }

        return next;
      }, { replace: true });
    },
    [setSearchParams]
  );

  const setFilter = useCallback(
    (key: ToolFilterKey, value: string | string[]) => {
      setFilters({ [key]: value } as Partial<ToolFilters>);
    },
    [setFilters]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.subcategory) count++;
    if (filters.pricing) count++;
    count += filters.tags.length;
    return count;
  }, [filters]);

  return { filters, setFilter, setFilters, clearFilters, activeFilterCount };
}
