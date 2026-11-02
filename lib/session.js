// small session using localStorage, so each page can read/write the same data

const KEY = "unify_session";

export function loadSession() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function saveSession(partial) {
  if (typeof window === "undefined") return;
  const next = { ...loadSession(), ...partial };
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
