#!/usr/bin/env node
const origin = (process.env.MCP_PUBLIC_ORIGIN || "https://agent.eliteencoder.net").replace(/\/+$/, "");
const mcp = `${origin}/api/mcp`;
const personal = process.argv.slice(2).join(" ");

const claude = `Claude: Settings → Connectors → Add custom connector. Paste only:
${mcp}
Complete the browser login. Do not add headers.`;

const codex = `Codex: Use MCP URL ${mcp}. Complete OAuth (DCR + PKCE, loopback /callback). Do not invent API keys. Stay within the campaign budget. Make the coolest thing you can.`;

const body = [
  personal || "",
  `MCP URL: ${mcp}`,
  "",
  claude,
  "",
  codex,
]
  .filter((line, i, arr) => !(i === 0 && line === "") || arr.length)
  .join("\n");

process.stdout.write(`${body.trim()}\n`);
