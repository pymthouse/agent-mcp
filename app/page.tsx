import { mcpResourceUrl } from "@/lib/env";

export default function HomePage() {
  let mcpUrl = "/api/mcp";
  try {
    mcpUrl = mcpResourceUrl();
  } catch {
    mcpUrl = "/api/mcp";
  }

  return (
    <main style={{ maxWidth: 640, margin: "4rem auto", padding: "0 1.5rem" }}>
      <h1 style={{ fontSize: 22, fontWeight: 600 }}>Livepeer Agent MCP</h1>
      <p style={{ color: "#a3a3a3", lineHeight: 1.5 }}>
        This host is a raw MCP resource server and the OAuth authorization
        server Claude talks to. Paste the URL below into Claude as a custom
        connector. Browser login is Console (Auth0). Console HTML is
        allowlist-gated separately.
      </p>
      <p>
        <code style={{ fontFamily: "ui-monospace, monospace", fontSize: 14 }}>
          {mcpUrl}
        </code>
      </p>
    </main>
  );
}
