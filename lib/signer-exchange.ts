import { pymthouseSignerUrl } from "./env";
import type { McpPrincipal } from "./jwt";
import { exchangeSignerViaConsole } from "./console-s2s";

export type SignerSession = {
  access_token: string;
  expires_in: number;
  signer_url: string;
  discovery_url?: string;
};

export async function exchangeUserJwtForSignerJwt(
  principal: McpPrincipal,
  req?: Request,
): Promise<SignerSession> {
  const session = await exchangeSignerViaConsole(principal.token, req);
  return {
    access_token: session.access_token,
    expires_in: session.expires_in ?? 300,
    signer_url: session.signer_url || pymthouseSignerUrl(),
    discovery_url: session.discovery_url,
  };
}
