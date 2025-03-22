// utils/calculationFormula.js
const calculateNutritionalValue = (
  baseQuantity,
  baseNutritionalValue,
  requestedQuantity
) => {
  // Ensure all values are numbers
  const baseQ = Number(parseFloat(baseQuantity));
  const baseN = Number(parseFloat(baseNutritionalValue));
  const reqQ = Number(parseFloat(requestedQuantity));

  if (isNaN(baseQ) || isNaN(baseN) || isNaN(reqQ) || baseQ === 0) {
    throw new Error("Invalid quantity or nutritional value");
  }

  const expectedNutritionalValue = (reqQ * baseN) / baseQ;
  // console.log(typeof expectedNutritionalValue);

  return (
    expectedNutritionalValue.toFixed(2) +
    " " +
    baseNutritionalValue.split(" ")[1]
  );
};

module.exports = calculateNutritionalValue;
