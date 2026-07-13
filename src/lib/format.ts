// Prices are in Indian Rupees (the bakery is in Panipat, Haryana).
const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return inr.format(Number(value) || 0);
}
