"use client";
import { useEffect, useRef, useState } from "react";

interface Ticker {
  symbol: string;
  name: string;
  price: string;
  change: string;
  pct: string;
  up: boolean;
}

const TICKERS: Ticker[] = [
  { symbol: "SPX",    name: "S&P 500",        price: "5,218.19", change: "+34.12", pct: "+0.66%", up: true  },
  { symbol: "NDX",    name: "NASDAQ 100",      price: "18,139.44",change: "+97.53", pct: "+0.54%", up: true  },
  { symbol: "DJI",    name: "Dow Jones",       price: "38,904.04",change: "-28.60", pct: "-0.07%", up: false },
  { symbol: "FTSE",   name: "FTSE 100",        price: "8,147.03", change: "+41.22", pct: "+0.51%", up: true  },
  { symbol: "DAX",    name: "DAX",             price: "18,384.35",change: "+76.88", pct: "+0.42%", up: true  },
  { symbol: "NIKKEI", name: "Nikkei 225",      price: "38,236.07",change: "-312.52",pct: "-0.81%", up: false },
  { symbol: "HSI",    name: "Hang Seng",       price: "16,828.45",change: "+124.16",pct: "+0.74%", up: true  },
  { symbol: "XAUUSD", name: "Gold",            price: "2,341.60", change: "+18.40", pct: "+0.79%", up: true  },
  { symbol: "XBRUSD", name: "Brent Crude",     price: "88.34",    change: "-0.62",  pct: "-0.70%", up: false },
  { symbol: "EURUSD", name: "EUR/USD",         price: "1.0834",   change: "+0.0012",pct: "+0.11%", up: true  },
  { symbol: "GBPUSD", name: "GBP/USD",         price: "1.2714",   change: "-0.0028",pct: "-0.22%", up: false },
  { symbol: "USDJPY", name: "USD/JPY",         price: "151.82",   change: "+0.44",  pct: "+0.29%", up: true  },
  { symbol: "BTC",    name: "Bitcoin",         price: "67,284.00",change: "+1,204", pct: "+1.82%", up: true  },
  { symbol: "ETH",    name: "Ethereum",        price: "3,412.55", change: "-42.10", pct: "-1.22%", up: false },
  { symbol: "MSFT",   name: "Microsoft",       price: "420.21",   change: "+5.88",  pct: "+1.42%", up: true  },
  { symbol: "AAPL",   name: "Apple",           price: "171.48",   change: "-1.12",  pct: "-0.65%", up: false },
  { symbol: "JPM",    name: "JPMorgan",        price: "197.45",   change: "+2.34",  pct: "+1.20%", up: true  },
  { symbol: "GS",     name: "Goldman Sachs",   price: "461.88",   change: "+7.62",  pct: "+1.68%", up: true  },
];

// Duplicate for seamless loop
const ITEMS = [...TICKERS, ...TICKERS];

export default function StockTicker() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // CSS animation — no JS scroll loop needed
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(6,6,10,0.97)",
        borderTop: "1px solid rgba(201,168,76,0.18)",
        backdropFilter: "blur(12px)",
        overflow: "hidden",
        height: 36,
        display: "flex",
        alignItems: "center",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Time stamp on the left */}
      <div style={{
        flexShrink: 0,
        padding: "0 0.85rem",
        fontSize: "0.58rem",
        fontWeight: 700,
        letterSpacing: "0.15em",
        color: "rgba(201,168,76,0.7)",
        textTransform: "uppercase",
        borderRight: "1px solid var(--border-dim)",
        whiteSpace: "nowrap",
        height: "100%",
        display: "flex",
        alignItems: "center",
      }}>
        Markets
      </div>

      {/* Scrolling track */}
      <div style={{ overflow: "hidden", flex: 1, position: "relative" }}>
        <div
          ref={trackRef}
          className={paused ? "ticker-track ticker-paused" : "ticker-track"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            whiteSpace: "nowrap",
          }}
        >
          {ITEMS.map((t, i) => (
            <div
              key={`${t.symbol}-${i}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0 1.25rem",
                borderRight: "1px solid var(--border-faint)",
                height: 36,
              }}
            >
              <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--text-hi)" }}>
                {t.symbol}
              </span>
              <span style={{ fontSize: "0.58rem", color: "var(--text-lo)", letterSpacing: "0.04em" }}>
                {t.name}
              </span>
              <span style={{ fontSize: "0.62rem", fontWeight: 600, color: "var(--text-hi)", letterSpacing: "0.04em" }}>
                {t.price}
              </span>
              <span style={{
                fontSize: "0.58rem",
                fontWeight: 600,
                color: t.up ? "#4ade80" : "#f87171",
                letterSpacing: "0.04em",
              }}>
                {t.change}
              </span>
              <span style={{
                fontSize: "0.55rem",
                color: t.up ? "rgba(74,222,128,0.65)" : "rgba(248,113,113,0.65)",
              }}>
                {t.pct}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ticker-track {
          animation: ticker-scroll 60s linear infinite;
        }
        .ticker-paused {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
