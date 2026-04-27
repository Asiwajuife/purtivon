export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          background: "#0a0a0f",
          color: "#f0ede6",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          textAlign: "center",
          padding: "4rem 2rem",
          margin: 0,
        }}
      >
        <div
          style={{
            fontSize: "7rem",
            fontWeight: 300,
            color: "#c9a84c",
            lineHeight: 1,
            marginBottom: "1.5rem",
            opacity: 0.6,
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            fontWeight: 300,
            marginBottom: "1rem",
            color: "#f0ede6",
          }}
        >
          Page not found
        </h1>
        <p
          style={{
            color: "#9a9490",
            marginBottom: "2.5rem",
            maxWidth: 380,
            lineHeight: 1.7,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: "1rem",
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.8rem 2rem",
            background: "#c9a84c",
            color: "#0a0a0f",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Return Home
        </a>
      </body>
    </html>
  );
}
