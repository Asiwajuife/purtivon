import { type JSONContent } from "@tiptap/react";

// Recursively render TipTap JSON to React elements — no client JS needed
function renderNode(node: JSONContent, index: number): React.ReactNode {
  const key = index;

  switch (node.type) {
    case "doc":
      return (
        <div key={key}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </div>
      );

    case "paragraph": {
      const children = node.content?.map((child, i) => renderNode(child, i));
      if (!children || children.length === 0) {
        return <p key={key} style={{ minHeight: "1em" }} />;
      }
      return <p key={key}>{children}</p>;
    }

    case "heading": {
      const level = node.attrs?.level ?? 2;
      const children = node.content?.map((child, i) => renderNode(child, i));
      const headingStyle: React.CSSProperties = {
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 300,
        lineHeight: 1.2,
        color: "#f0ede6",
        marginTop: "2rem",
        marginBottom: "0.75rem",
      };
      if (level === 1) return <h1 key={key} style={{ ...headingStyle, fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)" }}>{children}</h1>;
      if (level === 2) return <h2 key={key} style={{ ...headingStyle, fontSize: "clamp(1.3rem, 2vw, 1.8rem)", fontWeight: 400 }}>{children}</h2>;
      return <h3 key={key} style={{ ...headingStyle, fontSize: "clamp(1.1rem, 1.5vw, 1.35rem)", fontWeight: 400 }}>{children}</h3>;
    }

    case "text": {
      let el: React.ReactNode = node.text ?? "";
      const marks = node.marks ?? [];

      for (const mark of marks) {
        if (mark.type === "bold") el = <strong key={key}>{el}</strong>;
        else if (mark.type === "italic") el = <em key={key} style={{ fontStyle: "italic", color: "inherit" }}>{el}</em>;
        else if (mark.type === "link") {
          el = (
            <a
              key={key}
              href={mark.attrs?.href as string}
              target={mark.attrs?.target as string | undefined ?? "_blank"}
              rel="noopener noreferrer"
              style={{ color: "#c9a84c", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              {el}
            </a>
          );
        } else if (mark.type === "code") {
          el = (
            <code key={key} style={{ background: "rgba(255,255,255,0.06)", padding: "0.1em 0.35em", borderRadius: 3, fontSize: "0.85em" }}>
              {el}
            </code>
          );
        }
      }
      return el;
    }

    case "hardBreak":
      return <br key={key} />;

    case "bulletList":
      return (
        <ul key={key} style={{ paddingLeft: "1.5rem", margin: "0.75rem 0 1.25rem" }}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </ul>
      );

    case "orderedList":
      return (
        <ol key={key} style={{ paddingLeft: "1.5rem", margin: "0.75rem 0 1.25rem" }}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </ol>
      );

    case "listItem":
      return (
        <li key={key} style={{ marginBottom: "0.3rem", lineHeight: 1.75 }}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </li>
      );

    case "blockquote":
      return (
        <blockquote
          key={key}
          style={{
            borderLeft: "2px solid #c9a84c",
            margin: "1.5rem 0",
            padding: "1rem 1.5rem",
            background: "rgba(201,168,76,0.03)",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.1rem",
            fontStyle: "italic",
            fontWeight: 300,
            lineHeight: 1.75,
            color: "rgba(240,237,230,0.85)",
          }}
        >
          {node.content?.map((child, i) => renderNode(child, i))}
        </blockquote>
      );

    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={key}
          src={node.attrs?.src as string}
          alt={node.attrs?.alt as string | undefined ?? ""}
          style={{ maxWidth: "100%", height: "auto", borderRadius: 4, margin: "1.25rem 0", display: "block" }}
          loading="lazy"
        />
      );

    case "horizontalRule":
      return <hr key={key} style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "2rem 0" }} />;

    case "codeBlock":
      return (
        <pre
          key={key}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 4,
            padding: "1rem 1.25rem",
            overflowX: "auto",
            margin: "1rem 0",
            fontSize: "0.82rem",
            lineHeight: 1.7,
          }}
        >
          <code>
            {node.content?.map((child, i) => renderNode(child, i))}
          </code>
        </pre>
      );

    default:
      // Render children if any, ignore unknown node types gracefully
      if (node.content) {
        return <span key={key}>{node.content.map((child, i) => renderNode(child, i))}</span>;
      }
      return null;
  }
}

interface TipTapRendererProps {
  content: JSONContent | null | undefined;
}

export default function TipTapRenderer({ content }: TipTapRendererProps) {
  if (!content) return null;

  return (
    <div
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)",
        fontWeight: 300,
        lineHeight: 1.85,
        color: "rgba(240,237,230,0.88)",
      }}
    >
      {renderNode(content, 0)}
    </div>
  );
}
