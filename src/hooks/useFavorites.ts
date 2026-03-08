import { useCallback, useEffect, useEffectEvent, useMemo, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import type { Book } from "@/types/book";

const FAVORITES_KEY = "book-search:favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Book[]>(() =>
    readStorage(FAVORITES_KEY, []),
  );

  const syncFavorites = useEffectEvent(() => {
    setFavorites(readStorage(FAVORITES_KEY, []));
  });

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === FAVORITES_KEY) {
        syncFavorites();
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [syncFavorites]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((b) => b.id)),
    [favorites],
  );

  const isFavorite = useCallback(
    (id: string) => favoriteIds.has(id),
    [favoriteIds],
  );

  const toggleFavorite = useCallback((book: Book) => {
    setFavorites((current) => {
      const exists = current.some((item) => item.id === book.id);
      const next = exists
        ? current.filter((item) => item.id !== book.id)
        : [book, ...current];
      writeStorage(FAVORITES_KEY, next);
      return next;
    });
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  };
}
