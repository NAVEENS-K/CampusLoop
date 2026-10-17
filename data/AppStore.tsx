import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Listing, listings as seedListings } from "@/data/listings";
import { fetchListingsFromApi } from "@/data/api";

type AppStoreValue = {
  listings: Listing[];
  savedIds: string[];
  myListingIds: string[];
  toggleSaved: (id: string) => void;
  createListing: (listing: Omit<Listing, "id">) => Listing;
};
const StoreContext = createContext<AppStoreValue | null>(null);
const LISTINGS_KEY = "campusloop:listings:v1";
const SAVED_KEY = "campusloop:saved:v1";

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Listing[]>(seedListings);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [myListingIds, setMyListingIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [storedItems, storedSaved, storedMine] = await Promise.all([
          AsyncStorage.getItem(LISTINGS_KEY),
          AsyncStorage.getItem(SAVED_KEY),
          AsyncStorage.getItem("campusloop:mine:v1"),
        ]);
        if (!active) return;
        if (storedItems) setItems(JSON.parse(storedItems));
        if (storedSaved) setSavedIds(JSON.parse(storedSaved));
        if (storedMine) setMyListingIds(JSON.parse(storedMine));
      } catch {
        // Keep seeded demo data if local storage is unavailable.
      }
      try {
        const remoteItems = await fetchListingsFromApi();
        if (active && remoteItems && remoteItems.length > 0) {
          setItems(remoteItems);
        }
      } catch {
        // The app remains usable offline with locally persisted demo data.
      }
    })();
    return () => { active = false; };
  }, []);

  const toggleSaved = (id: string) => {
    setSavedIds(current => {
      const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
      void AsyncStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  };

  const createListing = (draft: Omit<Listing, "id">) => {
    const item: Listing = { ...draft, id: `local-${Date.now()}` };
    setItems(current => {
      const next = [item, ...current];
      void AsyncStorage.setItem(LISTINGS_KEY, JSON.stringify(next));
      return next;
    });
    setMyListingIds(current => {
      const next = [item.id, ...current];
      void AsyncStorage.setItem("campusloop:mine:v1", JSON.stringify(next));
      return next;
    });
    return item;
  };

  const value = useMemo(() => ({ listings: items, savedIds, myListingIds, toggleSaved, createListing }),
    [items, savedIds, myListingIds]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useAppStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useAppStore must be used inside AppStoreProvider");
  return value;
}