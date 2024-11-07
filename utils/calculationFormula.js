// utils/calculationFormula.js
const calculateNutritionalValue = (
  baseQuantity,
  baseNutritionalValue,
  requestedQuantity
) => {
  // Ensure all values are numbers
  const baseQ = Number(baseQuantity);
  const baseN = Number(baseNutritionalValue);
  const reqQ = Number(requestedQuantity);

  if (isNaN(baseQ) || isNaN(baseN) || isNaN(reqQ) || baseQ === 0) {
    throw new Error("Invalid quantity or nutritional value");
  }

  const expectedNutritionalValue = (reqQ * baseN) / baseQ;
  return parseFloat(expectedNutritionalValue);
};

module.exports = calculateNutritionalValue;
