const storage = {
  get: (key: string) => {
    return localStorage.getItem(key);
  },

  parse: (key: string) => {
    const item = storage.get(key);
    return item ? JSON.parse(item) : null;
  },
};

export { storage };
