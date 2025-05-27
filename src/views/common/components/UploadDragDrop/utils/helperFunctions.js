export const convertToBytes = (quantity, unit) => {
  const units = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
  };

  const normalizedUnit = unit.toUpperCase();

  if (!units[normalizedUnit]) {
    throw new Error("Invalid unit. Accepted units: B, KB, MB, GB, TB");
  }

  if (isNaN(quantity) || quantity < 0) {
    throw new Error(
      "Invalid quantity. Please provide a positive numeric value."
    );
  }

  return quantity * units[normalizedUnit];
};
