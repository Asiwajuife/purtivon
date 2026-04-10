import Stripe from "stripe";

let _stripe: Stripe | undefined;

function getStripeClient(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing environment variable: STRIPE_SECRET_KEY");
  _stripe = new Stripe(key, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
    appInfo: {
      name: "Purtivon",
      version: "1.0.0",
      url: process.env.NEXT_PUBLIC_APP_URL ?? "https://purtivon.com",
    },
  });
  return _stripe;
}

// Lazy proxy — only initialises when a property is first accessed at runtime,
// not at module-load time (which would crash the build if the key is absent).
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop: string | symbol) {
    return getStripeClient()[prop as keyof Stripe];
  },
});
