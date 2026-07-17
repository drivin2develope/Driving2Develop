"use client";

export interface CompositionItem {
  id: string;
  categorySlug: string;
  versionId: string;
}

export interface SavedComposition {
  name: string;
  items: CompositionItem[];
  savedAt: string;
}

const STORAGE_KEY = "d2d-design-composer-v1";

function uid() {
  return `item-${Math.random().toString(36).slice(2, 10)}`;
}

export function newItem(categorySlug: string, versionId: string): CompositionItem {
  return { id: uid(), categorySlug, versionId };
}

export function loadSavedCompositions(): SavedComposition[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveComposition(comp: SavedComposition) {
  const all = loadSavedCompositions().filter((c) => c.name !== comp.name);
  all.push(comp);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function deleteComposition(name: string) {
  const all = loadSavedCompositions().filter((c) => c.name !== name);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function encodeComposition(items: CompositionItem[]): string {
  return typeof window === "undefined" ? "" : window.btoa(encodeURIComponent(JSON.stringify(items)));
}

export function decodeComposition(encoded: string): CompositionItem[] | null {
  try {
    return JSON.parse(decodeURIComponent(window.atob(encoded)));
  } catch {
    return null;
  }
}
