# Claude custom connector

Paste **only** this URL into Claude Desktop → Settings → Connectors → Add custom connector:

```
https://<MCP_PUBLIC_ORIGIN>/api/mcp
```

Do not add headers, API keys, or a Vercel bypass query param.

Claude will:

1. Hit the MCP URL, receive `401` + `WWW-Authenticate` with `resource_metadata`
2. Read Protected Resource Metadata on this host (`authorization_servers` = this origin)
3. Register (DCR) and run PKCE against **this host**
4. Open a browser. Sign in with Console Auth0
5. Store the PymtHouse user JWT + Console-wrapped refresh token. Refresh goes through this host, which proxies Console.

Then ask it to make the coolest thing it can within the campaign budget.
