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
  remove: (key: string) => {
    return localStorage.removeItem(key);
  },

  clear: () => {
    return localStorage.clear();
  },
};

export { storage };
