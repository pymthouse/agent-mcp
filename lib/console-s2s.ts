import { consoleOrigin, mintCallerOrigin, mintSecret } from "./env";

export type McpUserTokenSet = {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
  expires_in: number;
  scope?: string;
};

export type SignerSession = {
  access_token: string;
  expires_in: number;
  signer_url?: string;
  discovery_url?: string;
};

class ConsoleS2sError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function consoleS2s<T>(
  path: string,
  body: unknown,
  req?: Request,
): Promise<T> {
  const res = await fetch(`${consoleOrigin()}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${mintSecret()}`,
      Origin: mintCallerOrigin(req),
      "X-Mcp-Caller-Origin": mintCallerOrigin(req),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as {
    error?: string;
    error_description?: string;
  } & T;
  if (!res.ok) {
    throw new ConsoleS2sError(
      res.status,
      json.error || "console_s2s_failed",
      json.error_description || json.error || `Console S2S failed (${res.status})`,
    );
  }
  return json;
}

export async function mintViaConsole(
  input: {
    code: string;
    externalUserId?: string;
    email?: string;
  },
  req?: Request,
): Promise<McpUserTokenSet> {
  const minted = await consoleS2s<McpUserTokenSet>(
    "/api/internal/mcp/mint",
    {
      code: input.code,
      ...(input.externalUserId
        ? { externalUserId: input.externalUserId }
        : {}),
      ...(input.email ? { email: input.email } : {}),
    },
    req,
  );
  if (!minted.access_token || !minted.refresh_token) {
    throw new Error("Console mint returned an incomplete token set");
  }
  return minted;
}

export async function refreshViaConsole(
  refreshToken: string,
  req?: Request,
): Promise<McpUserTokenSet> {
  const minted = await consoleS2s<McpUserTokenSet>(
    "/api/internal/mcp/refresh",
    { refresh_token: refreshToken },
    req,
  );
  if (!minted.access_token || !minted.refresh_token) {
    throw new Error("Console refresh returned an incomplete token set");
  }
  return minted;
}

export async function exchangeSignerViaConsole(
  accessToken: string,
  req?: Request,
): Promise<SignerSession> {
  const session = await consoleS2s<SignerSession>(
    "/api/internal/mcp/signer-session",
    { access_token: accessToken },
    req,
  );
  if (!session.access_token) {
    throw new Error("Console signer-session returned no access_token");
  }
  return session;
}
