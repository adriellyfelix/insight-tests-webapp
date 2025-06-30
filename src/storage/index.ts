const storage = {
  set: (key: string, payload: any) => {
    return localStorage.setItem(key, JSON.stringify(payload));
  },

  get: (key: string) => {
    return localStorage.getItem(key);
  },

  parse: (key: string) => {
    const item = storage.get(key);
    return item ? JSON.parse(item) : null;
  },

  clear: () => {
    return localStorage.clear();
  },
};

export { storage };
