export const getParam = (key: string): string | null =>
  new URLSearchParams(window.location.search).get(key);

export const setParam = (key: string, value: string | null): void => {
  const params = new URLSearchParams(window.location.search);
  if (value === null) {
    params.delete(key);
  } else {
    params.set(key, value);
  }
  const query = params.toString();
  const url = query
    ? `${window.location.pathname}?${query}${window.location.hash}`
    : `${window.location.pathname}${window.location.hash}`;
  window.history.replaceState(null, "", url);
};

export const readBool = (key: string, defaultValue: boolean): boolean => {
  const v = getParam(key);
  if (v === "1") return true;
  if (v === "0") return false;
  return defaultValue;
};

export const writeBool = (
  key: string,
  value: boolean,
  defaultValue: boolean,
): void => {
  setParam(key, value === defaultValue ? null : value ? "1" : "0");
};

export const readNumber = (key: string, defaultValue: number): number => {
  const v = getParam(key);
  if (v === null) return defaultValue;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : defaultValue;
};

export const writeNumber = (
  key: string,
  value: number,
  defaultValue: number,
): void => {
  setParam(key, value === defaultValue ? null : String(value));
};

export const readEnum = <T extends string>(
  key: string,
  allowed: readonly T[],
  defaultValue: T,
): T => {
  const v = getParam(key);
  if (v !== null && (allowed as readonly string[]).includes(v)) {
    return v as T;
  }
  return defaultValue;
};

export const writeEnum = <T extends string>(
  key: string,
  value: T,
  defaultValue: T,
): void => {
  setParam(key, value === defaultValue ? null : value);
};
