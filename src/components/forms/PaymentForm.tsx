"use client";
import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe as StripeType } from "@stripe/stripe-js";
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
}
  throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
interface InnerFormProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  returnUrl: string;
}
function InnerPaymentForm({ onSuccess, onError, returnUrl }: InnerFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);
    const { error: submitError } = await elements.submit();
    if (submitError) {
      const msg = submitError.message ?? "Validation failed.";
      setError(msg);
      onError?.(msg);
      setLoading(false);
      return;
    }
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });
    if (confirmError) {
      const msg =
        confirmError.type === "card_error" ||
        confirmError.type === "validation_error"
          ? (confirmError.message ?? "Payment failed.")
          : "An unexpected error occurred. Please try again.";
      setError(msg);
      onError?.(msg);
    } else {
    }
      onSuccess?.();
    setLoading(false);
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="rounded-sm border border-white/[0.08] bg-white/[0.02] p-4 focus-within:border-[#c9a84c]/30 transition-all duration-200">
        <PaymentElement
          onReady={() => setReady(true)}
          options={{ layout: "tabs", paymentMethodOrder: ["card"] }}
        />
      </div>
      {error && (
        <div className="flex items-start gap-3 px-4 py-3 border border-red-400/10 bg-red-400/5 rounded-sm">
          <svg
            className="w-4 h-4 text-red-400/70 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <p className="text-red-400/80 text-xs leading-relaxed">{error}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || !elements || !ready || loading}
        className="flex items-center justify-center gap-2.5 w-full py-4 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#0a0a0f] text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <svg
            className="w-3.5 h-3.5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        ) : (
          <>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
            Pay Securely
          </>
        )}
      </button>
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-1.5 text-white/20">
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            />
          </svg>
          <span className="text-[10px] tracking-widest uppercase">
            SSL Secured
          </span>
        </div>
        <span className="w-px h-3 bg-white/5" />
        <span className="text-[10px] tracking-widest uppercase text-white/20">
          Powered by Stripe
        </span>
      </div>
    </form>
  );
}
interface PaymentFormProps {
  clientSecret: string;
  returnUrl?: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}
export default function PaymentForm({
  clientSecret,
  returnUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/dashboard/payments/success`,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const [stripe, setStripe] = useState<StripeType | null>(null);
  useEffect(() => {
    stripePromise.then((s) => setStripe(s));
  }, []);
  if (!stripe) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg
          className="w-5 h-5 animate-spin text-[#c9a84c]/40"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      </div>
    );
  }
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#c9a84c",
            colorBackground: "#0f0f14",
            colorSurface: "#141419",
            colorText: "#e5e5e5",
            colorTextSecondary: "#6b6b7a",
            colorTextPlaceholder: "#3f3f4e",
            colorDanger: "#f87171",
            borderRadius: "2px",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            spacingUnit: "4px",
          },
          rules: {
            ".Input": {
              border: "1px solid rgba(255,255,255,0.06)",
              backgroundColor: "rgba(255,255,255,0.02)",
              color: "#e5e5e5",
              boxShadow: "none",
            },
            ".Input:focus": {
              border: "1px solid rgba(201,168,76,0.35)",
              boxShadow: "none",
              outline: "none",
            },
            ".Label": {
              color: "rgba(255,255,255,0.35)",
              fontSize: "10px",
              fontWeight: "600",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            },
            ".Tab": {
              border: "1px solid rgba(255,255,255,0.05)",
              backgroundColor: "rgba(255,255,255,0.02)",
            },
            ".Tab--selected": {
              border: "1px solid rgba(201,168,76,0.3)",
              backgroundColor: "rgba(201,168,76,0.05)",
            },
          },
        },
      }}
    >
      <InnerPaymentForm
        onSuccess={onSuccess}
        onError={onError}
        returnUrl={returnUrl}
      />
    </Elements>
  );
}
