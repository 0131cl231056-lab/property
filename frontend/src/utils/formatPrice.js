export const formatPrice = (price) => {
  if (!price) return "₹0";

  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  }

  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2).replace(/\.00$/, "")} Lakh`;
  }

  return `₹${price.toLocaleString("en-IN")}`;
};