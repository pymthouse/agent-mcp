# Livepeer Agent MCP

Raw MCP resource server **and** OAuth authorization server. Claude pastes `https://<origin>/api/mcp`. DCR + PKCE live on this origin. Browser login is **Console Auth0**. PymtHouse is billing/signer only — it is not the thing Claude talks to.

## Deploy

Vercel production with **Deployment Protection off** (Fluid Compute). Preview deployments are untestable with Claude. `maxDuration = 800` on `/api/mcp`.

```bash
pnpm install
pnpm dev
```

Set `MCP_PUBLIC_ORIGIN` to the public https origin (no trailing slash). PRM `resource` must equal `{origin}/api/mcp`. PRM `authorization_servers` is **this origin**.

Console must set `MCP_INTERNAL_MINT_SECRET` (same as `SSO_MINT_SECRET` here), `MCP_INTERNAL_MINT_ALLOWLIST` to this origin, and `CONSOLE_EMAIL_ALLOWLIST` for HTML. This host never receives M2M or Auth0.

## Endpoints

| Path | Role |
|---|---|
| `/.well-known/oauth-protected-resource` | RFC 9728 PRM (`authorization_servers` = this origin) |
| `/.well-known/oauth-authorization-server` | RFC 8414 AS metadata |
| `/register` | RFC 7591 DCR (Claude + loopback `/callback` only) |
| `/authorize` | PKCE S256 → Console `/login?mcp_oauth=1` |
| `/api/mcp/oauth/callback` | Console identity `code` → Claude redirect |
| `/token` | `authorization_code` + `refresh_token` via Console S2S |
| `/api/mcp` | Streamable HTTP MCP (raw tools) |

See `docs/claude-connector.md` and `docs/codex-prompt.md`. Invite copy: `pnpm invite`.
# agent-mcp
