export function formatCurrency(amount, currency = "USD") {
  const normalizedAmount = Number(amount) || 0;

  return `${currency} ${normalizedAmount.toFixed(2)}`;
}

export function calculatePromoReceipt(items, promoPrice) {
  const normalizedItems = Array.isArray(items)
    ? items.map((item) => {
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unitPrice) || 0;
        const lineTotal = quantity * unitPrice;

        return {
          ...item,
          quantity,
          unitPrice,
          lineTotal,
        };
      })
    : [];

  const totalRetailValue = normalizedItems.reduce(
    (sum, item) => sum + item.lineTotal,
    0,
  );
  const finalPrice = Number(promoPrice) || 0;
  const savings = totalRetailValue - finalPrice;
  const savingsPercent = totalRetailValue
    ? Math.round((savings / totalRetailValue) * 100)
    : 0;

  return {
    items: normalizedItems,
    totalRetailValue,
    finalPrice,
    savings,
    savingsPercent,
  };
}