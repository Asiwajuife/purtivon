import Stripe from "stripe";
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing environment variable: STRIPE_SECRET_KEY");
}
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
  appInfo: {
    name: "Purtivon",
    version: "1.0.0",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://purtivon.com",
  },
});
