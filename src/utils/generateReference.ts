const generateRef = (): string => {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `LPMFB-${date}-${random}`;
};

export default generateRef;
