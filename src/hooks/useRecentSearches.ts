import { useEffect, useEffectEvent, useState } from "react";
import { pushRecentSearch, readStorage, writeStorage } from "@/lib/storage";

const RECENT_SEARCHES_KEY = "book-search:recent-searches";

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    readStorage(RECENT_SEARCHES_KEY, []),
  );

  const syncRecentSearches = useEffectEvent(() => {
    setRecentSearches(readStorage(RECENT_SEARCHES_KEY, []));
  });

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === RECENT_SEARCHES_KEY) {
        syncRecentSearches();
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [syncRecentSearches]);

  function addRecentSearch(keyword: string) {
    setRecentSearches((current) => {
      const next = pushRecentSearch(current, keyword);
      writeStorage(RECENT_SEARCHES_KEY, next);
      return next;
    });
  }

  function removeRecentSearch(keyword: string) {
    setRecentSearches((current) => {
      const next = current.filter((entry) => entry !== keyword);
      writeStorage(RECENT_SEARCHES_KEY, next);
      return next;
    });
  }

  function clearRecentSearches() {
    writeStorage(RECENT_SEARCHES_KEY, []);
    setRecentSearches([]);
  }

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
}
