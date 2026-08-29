# Codex / agent prompt

You are connected to the Livepeer raw MCP at the URL I pasted. Use `list_capabilities` then `run_capability` with exact capability names. Stay within the campaign spend cap (`spend_cap` / `me_usage`). Produce the coolest finished media you can.

If the MCP client supports OAuth (DCR + PKCE), complete the browser login on Console. Loopback `http://127.0.0.1/callback` (and localhost / `::1`) is enough — do not invent a device-code grant.

If a tool call returns HTTP 401, retry after OAuth. Do not invent API keys. Do not call PymtHouse URLs.
