import assert from "node:assert/strict";
import { test } from "node:test";

import {
  issueAuthCode,
  issueClientId,
  issuePending,
  parseAuthCode,
  parseClientId,
  parsePending,
  sha256Base64Url,
  verifyPkceS256,
} from "./as.ts";

process.env.MCP_AS_SECRET = "test-as-secret";

test("DCR client_id round-trips redirect URIs", () => {
  const id = issueClientId(["https://claude.ai/api/mcp/auth_callback"]);
  const parsed = parseClientId(id);
  assert.deepEqual(parsed?.redirectUris, [
    "https://claude.ai/api/mcp/auth_callback",
  ]);
  assert.equal(parseClientId(`${id}x`), null);
});

test("pending and auth code round-trip", () => {
  const pending = issuePending({
    nonce: "n1",
    clientId: "mcp_c_x",
    clientState: "claude-state",
    redirectUri: "https://claude.ai/api/mcp/auth_callback",
    codeChallenge: "challenge",
  });
  const parsed = parsePending(pending);
  assert.equal(parsed?.nonce, "n1");
  assert.equal(parsed?.clientState, "claude-state");

  const code = issueAuthCode({
    identityCode: "mcp_id_abc",
    redirectUri: parsed!.redirectUri,
    codeChallenge: parsed!.codeChallenge,
    clientId: parsed!.clientId,
    externalUserId: "eu_1",
  });
  const grant = parseAuthCode(code);
  assert.equal(grant?.identityCode, "mcp_id_abc");
  assert.equal(grant?.externalUserId, "eu_1");
});

test("PKCE S256 verifier matches challenge", () => {
  const verifier = "a".repeat(64);
  const challenge = sha256Base64Url(verifier);
  assert.equal(verifyPkceS256(verifier, challenge), true);
  assert.equal(verifyPkceS256(`${verifier}x`, challenge), false);
});
