// Stripe product/price IDs for FlowBooking tiers
export const STRIPE_TIERS = {
  basic: {
    product_id: "prod_U0ze0JqoMCb5Up",
    price_id: "price_1T2xfbEGKumAbgWwOFOQCfvN",
    name: "Basic",
    monthlyPrice: 49,
  },
  professional: {
    product_id: "prod_U0zg0kxz3sqccL",
    price_id: "price_1T2xgkEGKumAbgWwyX01T662",
    name: "Professional",
    monthlyPrice: 149,
  },
  premium: {
    product_id: "prod_U0zhQ6qsR6xoSz",
    price_id: "price_1T2xhhEGKumAbgWwAoXY60No",
    name: "Premium",
    monthlyPrice: 299,
  },
} as const;

export type StripeTier = keyof typeof STRIPE_TIERS;

export function getTierByProductId(productId: string): StripeTier | null {
  for (const [tier, config] of Object.entries(STRIPE_TIERS)) {
    if (config.product_id === productId) return tier as StripeTier;
  }
  return null;
}
