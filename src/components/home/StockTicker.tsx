"use client";
import { useState } from "react";

interface Ticker {
  symbol: string;
  name: string;
  price: string;
  change: string;
  pct: string;
  up: boolean;
}

const TICKERS: Ticker[] = [
  { symbol: "SPX",    name: "S&P 500",       price: "5,218.19",  change: "+34.12",  pct: "+0.66%", up: true  },
  { symbol: "NDX",    name: "NASDAQ 100",    price: "18,139.44", change: "+97.53",  pct: "+0.54%", up: true  },
  { symbol: "DJI",    name: "Dow Jones",     price: "38,904.04", change: "-28.60",  pct: "-0.07%", up: false },
  { symbol: "FTSE",   name: "FTSE 100",      price: "8,147.03",  change: "+41.22",  pct: "+0.51%", up: true  },
  { symbol: "DAX",    name: "DAX",           price: "18,384.35", change: "+76.88",  pct: "+0.42%", up: true  },
  { symbol: "NIKKEI", name: "Nikkei 225",    price: "38,236.07", change: "-312.52", pct: "-0.81%", up: false },
  { symbol: "HSI",    name: "Hang Seng",     price: "16,828.45", change: "+124.16", pct: "+0.74%", up: true  },
  { symbol: "XAUUSD", name: "Gold",          price: "2,341.60",  change: "+18.40",  pct: "+0.79%", up: true  },
  { symbol: "XBRUSD", name: "Brent Crude",   price: "88.34",     change: "-0.62",   pct: "-0.70%", up: false },
  { symbol: "EURUSD", name: "EUR/USD",       price: "1.0834",    change: "+0.0012", pct: "+0.11%", up: true  },
  { symbol: "GBPUSD", name: "GBP/USD",       price: "1.2714",    change: "-0.0028", pct: "-0.22%", up: false },
  { symbol: "USDJPY", name: "USD/JPY",       price: "151.82",    change: "+0.44",   pct: "+0.29%", up: true  },
  { symbol: "BTC",    name: "Bitcoin",       price: "67,284.00", change: "+1,204",  pct: "+1.82%", up: true  },
  { symbol: "ETH",    name: "Ethereum",      price: "3,412.55",  change: "-42.10",  pct: "-1.22%", up: false },
  { symbol: "MSFT",   name: "Microsoft",     price: "420.21",    change: "+5.88",   pct: "+1.42%", up: true  },
  { symbol: "AAPL",   name: "Apple",         price: "171.48",    change: "-1.12",   pct: "-0.65%", up: false },
  { symbol: "JPM",    name: "JPMorgan",      price: "197.45",    change: "+2.34",   pct: "+1.20%", up: true  },
  { symbol: "GS",     name: "Goldman Sachs", price: "461.88",    change: "+7.62",   pct: "+1.68%", up: true  },
];

const ITEMS = [...TICKERS, ...TICKERS];

export default function StockTicker() {
  const [paused, setPaused] = useState(false);

  return (
    <div
      aria-label="Market data ticker"
      style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 98,
        background: "rgba(4, 5, 14, 0.96)",
        borderTop: "1px solid rgba(201,168,76,0.18)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        overflow: "hidden",
        height: 34,
        display: "flex",
        alignItems: "center",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Scan-line texture */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
        zIndex: 1,
      }} />

      {/* Left edge fade */}
      <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 52, bottom: 0, width: 40, background: "linear-gradient(90deg, rgba(4,5,14,0.96), transparent)", pointerEvents: "none", zIndex: 2 }} />
      {/* Right edge fade */}
      <div aria-hidden="true" style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 40, background: "linear-gradient(-90deg, rgba(4,5,14,0.96), transparent)", pointerEvents: "none", zIndex: 2 }} />

      {/* "Markets" label */}
      <div style={{
        flexShrink: 0,
        padding: "0 0.85rem",
        height: "100%",
        display: "flex", alignItems: "center",
        borderRight: "1px solid rgba(201,168,76,0.15)",
        background: "rgba(201,168,76,0.06)",
        zIndex: 3, position: "relative",
      }}>
        <span style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: "0.56rem",
          fontWeight: 700,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "rgba(201,168,76,0.85)",
          whiteSpace: "nowrap",
        }}>
          Markets
        </span>
      </div>

      {/* Scrolling track */}
      <div style={{ overflow: "hidden", flex: 1, position: "relative", zIndex: 1 }}>
        <div
          className={paused ? "tkr-track tkr-paused" : "tkr-track"}
          style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}
        >
          {ITEMS.map((t, i) => (
            <div
              key={`${t.symbol}-${i}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.38rem",
                padding: "0 1.1rem",
                borderRight: "1px solid rgba(255,255,255,0.05)",
                height: 34,
                flexShrink: 0,
              }}
            >
              {/* Up/down triangle */}
              <span aria-hidden="true" style={{
                fontSize: "0.5rem",
                color: t.up ? "#4ADE80" : "#F87171",
                lineHeight: 1,
              }}>
                {t.up ? "▲" : "▼"}
              </span>

              <span style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: t.up ? "#C9A84C" : "rgba(255,255,255,0.8)",
              }}>
                {t.symbol}
              </span>

              <span style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: "0.57rem",
                color: "rgba(255,255,255,0.38)",
                letterSpacing: "0.03em",
              }}>
                {t.name}
              </span>

              <span style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                fontSize: "0.6rem",
                fontWeight: 500,
                color: "rgba(255,255,255,0.88)",
                letterSpacing: "0.04em",
              }}>
                {t.price}
              </span>

              <span style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                fontSize: "0.58rem",
                fontWeight: 600,
                color: t.up ? "#4ADE80" : "#F87171",
              }}>
                {t.pct}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .tkr-track {
          animation: tkr-scroll 65s linear infinite;
          -webkit-animation: tkr-scroll 65s linear infinite;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .tkr-paused {
          animation-play-state: paused !important;
          -webkit-animation-play-state: paused !important;
        }
        @-webkit-keyframes tkr-scroll {
          0%   { -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); }
          100% { -webkit-transform: translate3d(-50%, 0, 0); transform: translate3d(-50%, 0, 0); }
        }
        @keyframes tkr-scroll {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </div>
  );
}
