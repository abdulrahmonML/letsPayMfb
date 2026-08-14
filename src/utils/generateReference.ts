// TRANSACTION REFERENCE GENERATOR
const generateRef = () => {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, ""); // YYMMDD
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `LPMFB-${date}-${random}`;
};

/* console.log(generateRef()); */ // Output: LPMFB-240520-A1B2C

module.exports = generateRef;
