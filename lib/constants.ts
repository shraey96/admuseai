// Pricing
export const PRICING = {
  CREDITS_PRICE: 1.99,
  CURRENCY: "USD",
  CREDITS_PER_PURCHASE: 1,
};

// Format price with currency
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

// Get formatted standard price
export const getFormattedPrice = (): string => {
  return formatPrice(PRICING.CREDITS_PRICE);
};

// Get price value without currency symbol for SEO compliance
export const getPriceValue = (): string => {
  return PRICING.CREDITS_PRICE.toFixed(2);
};
