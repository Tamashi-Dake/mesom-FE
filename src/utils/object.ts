export const omit = <T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[],
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key)),
  ) as Partial<T>;
};

export const select = <T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[],
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => keys.includes(key)),
  ) as Partial<T>;
};
