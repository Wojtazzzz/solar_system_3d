import { readBool, readEnum, readNumber, writeBool, writeEnum, writeNumber } from "./urlState";

export const bindCheckbox = (
  id: string,
  key: string,
  defaultValue: boolean,
  apply: (value: boolean) => void,
): void => {
  const el = document.querySelector<HTMLInputElement>(`#${id}`);
  if (!el) return;
  const initial = readBool(key, defaultValue);
  el.checked = initial;
  apply(initial);
  el.addEventListener("change", () => {
    apply(el.checked);
    writeBool(key, el.checked, defaultValue);
  });
};

export const bindRange = (
  id: string,
  outputId: string | null,
  key: string,
  defaultValue: number,
  formatOutput: ((value: number) => string) | null,
  applyLive: ((value: number) => void) | null,
  applyCommit?: (value: number) => void,
): void => {
  const el = document.querySelector<HTMLInputElement>(`#${id}`);
  if (!el) return;
  const output = outputId
    ? document.querySelector<HTMLOutputElement>(`#${outputId}`)
    : null;
  const min = parseFloat(el.min);
  const max = parseFloat(el.max);
  const raw = readNumber(key, defaultValue);
  const initial = Math.max(min, Math.min(max, raw));
  el.value = String(initial);
  if (output) {
    output.textContent = formatOutput ? formatOutput(initial) : String(initial);
  }
  applyLive?.(initial);
  if (applyCommit && initial !== defaultValue) applyCommit(initial);

  el.addEventListener("input", () => {
    const v = parseFloat(el.value);
    if (output) {
      output.textContent = formatOutput ? formatOutput(v) : el.value;
    }
    applyLive?.(v);
  });
  el.addEventListener("change", () => {
    const v = parseFloat(el.value);
    applyCommit?.(v);
    writeNumber(key, v, defaultValue);
  });
};

export const bindSelect = <T extends string>(
  id: string,
  key: string,
  allowed: readonly T[],
  defaultValue: T,
  apply: (value: T) => void,
): void => {
  const el = document.querySelector<HTMLSelectElement>(`#${id}`);
  if (!el) return;
  const initial = readEnum(key, allowed, defaultValue);
  el.value = initial;
  apply(initial);
  el.addEventListener("change", () => {
    const v = el.value as T;
    apply(v);
    writeEnum(key, v, defaultValue);
  });
};
