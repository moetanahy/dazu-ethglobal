export interface Currency {
  code: string;
  name: string;
  type: "crypto" | "fiat";
}

export const currencies: Currency[] = [
  { code: "USDC", name: "USD Coin", type: "crypto" },
  { code: "EURC", name: "Euro Coin", type: "crypto" },
  { code: "BTC", name: "Bitcoin", type: "crypto" },
  { code: "USD", name: "US Dollar", type: "fiat" },
  { code: "EUR", name: "Euro", type: "fiat" },
  { code: "GBP", name: "British Pound", type: "fiat" },
  { code: "JPY", name: "Japanese Yen", type: "fiat" },
  // Add more currencies as needed
];

export const groupedCurrencies = {
  crypto: currencies.filter(currency => currency.type === "crypto"),
  fiat: currencies.filter(currency => currency.type === "fiat"),
};
