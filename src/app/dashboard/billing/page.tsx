import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Billing" };

const PALETTE = {
  bg: "#0a0a0f",
  surface: "#141420",
  border: "rgba(255,255,255,0.07)",
  gold: "#c9a84c",
  textPrimary: "#f0ede6",
  textMuted: "rgba(255,255,255,0.35)",
} as const;

type Plan = "FREE" | "PRO" | "ENTERPRISE";

const PLANS: {
  key: Plan;
  label: string;
  price: string | null;
  priceNote: string;
  features: string[];
}[] = [
  {
    key: "FREE",
    label: "Free",
    price: null,
    priceNote: "No charge",
    features: [
      "1 award nomination",
      "Basic submission dashboard",
      "Public insights access",
      "Email support",
    ],
  },
  {
    key: "PRO",
    label: "Pro",
    price: "£49",
    priceNote: "per month",
    features: [
      "5 award nominations",
      "FDI Intelligence Reports",
      "Priority support",
      "Advanced analytics",
      "PDF certificate downloads",
    ],
  },
  {
    key: "ENTERPRISE",
    label: "Enterprise",
    price: "£199",
    priceNote: "per month",
    features: [
      "Unlimited nominations",
      "Dedicated account manager",
      "White-label reports",
      "Custom integrations",
      "SLA guarantee",
      "Onboarding sessions",
    ],
  },
];

function PlanBadge({ plan }: { plan: Plan }) {
  const isPaid = plan !== "FREE";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.2rem 0.55rem",
        fontSize: "0.58rem",
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        borderRadius: 3,
        background: isPaid ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.05)",
        color: isPaid ? PALETTE.gold : PALETTE.textMuted,
        border: `1px solid ${isPaid ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      {plan}
    </span>
  );
}

function UpgradeButton({ planKey }: { planKey: Plan }) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        disabled
        style={{
          width: "100%",
          padding: "0.6rem 1rem",
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: PALETTE.gold,
          background: "rgba(201,168,76,0.08)",
          border: "1px solid rgba(201,168,76,0.25)",
          borderRadius: 3,
          cursor: "not-allowed",
          opacity: 0.7,
        }}
        title="Coming Soon"
      >
        Upgrade to {planKey === "PRO" ? "Pro" : "Enterprise"}
      </button>
      <span
        style={{
          position: "absolute",
          bottom: "calc(100% + 6px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#1c1c2c",
          border: `1px solid ${PALETTE.border}`,
          color: PALETTE.textMuted,
          fontSize: "0.6rem",
          letterSpacing: "0.1em",
          padding: "0.28rem 0.6rem",
          borderRadius: 3,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.15s",
        }}
        className="upgrade-tooltip"
      >
        Coming Soon
      </span>
    </div>
  );
}

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  const currentPlan = (user?.plan ?? "FREE") as Plan;
  const isPaid = currentPlan !== "FREE";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.75rem",
        maxWidth: 860,
      }}
    >
      {/* Header */}
      <div
        style={{
          paddingBottom: "0.75rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: "0.6rem",
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: PALETTE.gold,
            marginBottom: "0.3rem",
          }}
        >
          Account
        </span>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
            fontSize: "1.4rem",
            fontWeight: 300,
            color: PALETTE.textPrimary,
            letterSpacing: "0.01em",
            margin: 0,
          }}
        >
          Billing &amp; Plan
        </h1>
      </div>

      {/* Current Plan Card */}
      <div
        style={{
          padding: "1.25rem 1.4rem",
          background: isPaid ? "rgba(201,168,76,0.04)" : PALETTE.surface,
          border: `1px solid ${isPaid ? "rgba(201,168,76,0.28)" : PALETTE.border}`,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: PALETTE.textMuted,
            }}
          >
            Current Plan
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
                fontSize: "1.6rem",
                fontWeight: 300,
                color: isPaid ? PALETTE.gold : PALETTE.textPrimary,
                margin: 0,
                letterSpacing: "0.02em",
              }}
            >
              {currentPlan === "FREE"
                ? "Free"
                : currentPlan === "PRO"
                ? "Pro"
                : "Enterprise"}
            </p>
            <PlanBadge plan={currentPlan} />
          </div>
          <p style={{ fontSize: "0.68rem", color: PALETTE.textMuted, margin: 0 }}>
            {currentPlan === "FREE"
              ? "You are on the free tier. Upgrade to unlock more nominations and features."
              : currentPlan === "PRO"
              ? "You have access to FDI Reports, Priority Support, and up to 5 nominations."
              : "You have full platform access including white-label reports and a dedicated manager."}
          </p>
        </div>
        {currentPlan === "FREE" && (
          <div style={{ flexShrink: 0 }}>
            <UpgradeButton planKey="PRO" />
          </div>
        )}
      </div>

      {/* Plan Comparison Cards */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "0.85rem",
          }}
        >
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: PALETTE.textMuted,
              whiteSpace: "nowrap",
            }}
          >
            Available Plans
          </span>
          <div
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.75rem",
          }}
        >
          {PLANS.map((plan) => {
            const isCurrent = plan.key === currentPlan;
            const isPaidPlan = plan.key !== "FREE";

            return (
              <div
                key={plan.key}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  padding: "1.1rem 1.15rem",
                  background: isCurrent
                    ? "rgba(201,168,76,0.04)"
                    : PALETTE.surface,
                  border: `1px solid ${isCurrent ? "rgba(201,168,76,0.3)" : PALETTE.border}`,
                  borderRadius: 4,
                  position: "relative",
                }}
              >
                {isCurrent && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-1px",
                      right: 14,
                      fontSize: "0.52rem",
                      fontWeight: 700,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: PALETTE.gold,
                      background: "#0a0a0f",
                      padding: "0 0.4rem",
                      lineHeight: "0",
                      transform: "translateY(-50%)",
                    }}
                  >
                    Current
                  </span>
                )}

                <div>
                  <p
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      color: isPaidPlan ? PALETTE.gold : PALETTE.textPrimary,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      margin: "0 0 0.35rem",
                    }}
                  >
                    {plan.label}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                    <span
                      style={{
                        fontFamily:
                          "'Cormorant Garamond', 'Didot', 'Georgia', serif",
                        fontSize: plan.price ? "1.4rem" : "1rem",
                        fontWeight: 300,
                        color: PALETTE.textPrimary,
                        letterSpacing: "0.01em",
                      }}
                    >
                      {plan.price ?? "Free"}
                    </span>
                    {plan.price && (
                      <span
                        style={{ fontSize: "0.6rem", color: PALETTE.textMuted }}
                      >
                        {plan.priceNote}
                      </span>
                    )}
                  </div>
                </div>

                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.45rem",
                    flex: 1,
                  }}
                >
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.45rem",
                        fontSize: "0.68rem",
                        color: PALETTE.textMuted,
                        lineHeight: 1.4,
                      }}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={PALETTE.gold}
                        strokeWidth={2.5}
                        style={{ flexShrink: 0, marginTop: 2 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>

                {!isCurrent && isPaidPlan && (
                  <UpgradeButton planKey={plan.key} />
                )}

                {isCurrent && (
                  <p
                    style={{
                      fontSize: "0.62rem",
                      color: PALETTE.gold,
                      margin: 0,
                      textAlign: "center",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Active plan
                  </p>
                )}

                {!isCurrent && !isPaidPlan && (
                  <p
                    style={{
                      fontSize: "0.62rem",
                      color: PALETTE.textMuted,
                      margin: 0,
                      textAlign: "center",
                    }}
                  >
                    Downgrade not available
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment History */}
      <div
        style={{
          background: PALETTE.surface,
          border: `1px solid ${PALETTE.border}`,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "0.85rem 1.25rem",
            borderBottom: `1px solid ${PALETTE.border}`,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: PALETTE.textMuted,
            }}
          >
            Payment History
          </span>
        </div>
        <div
          style={{
            padding: "2.5rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
            />
          </svg>
          <p
            style={{
              fontSize: "0.78rem",
              color: PALETTE.textMuted,
              margin: 0,
              textAlign: "center",
            }}
          >
            No transactions yet
          </p>
          <p
            style={{
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.18)",
              margin: 0,
              textAlign: "center",
            }}
          >
            Your billing history will appear here once you upgrade.
          </p>
        </div>
      </div>
    </div>
  );
}
