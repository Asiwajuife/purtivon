import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";
export const config = {
  api: { bodyParser: false },
};
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
    );
      { error: "Missing stripe-signature header." },
      { status: 400 }
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook secret not configured." },
      { status: 500 }
    );
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed." },
      { status: 400 }
    );
  }
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe] PaymentIntent succeeded: ${paymentIntent.id}`);
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error(`[Stripe] PaymentIntent failed: ${paymentIntent.id}`);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(
          `[Stripe] Subscription ${event.type}: ${subscription.id}`
        );
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[Stripe] Subscription cancelled: ${subscription.id}`);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Stripe] Invoice paid: ${invoice.id}`);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.error(`[Stripe] Invoice payment failed: ${invoice.id}`);
        break;
      }
      default:
        console.log(`[Stripe] Unhandled event type: ${event.type}`);
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[Stripe Webhook] Handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 }
    );
  }
}
