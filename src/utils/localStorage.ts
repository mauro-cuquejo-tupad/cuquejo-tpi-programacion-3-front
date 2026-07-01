// --- Generic LocalStorage Driver ---

export const getData = <T>(key: string): T | null => {
  const data = localStorage.getItem(key);
  if (!data) return null;
  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
};

export const saveData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const removeData = (key: string): void => {
  localStorage.removeItem(key);
};

export const getJsonData = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveJsonData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};