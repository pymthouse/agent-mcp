export const runtime = "edge";
export const revalidate = 60;

import { corsHeaders, prmBody } from "@/lib/oauth";

export async function GET(req: Request): Promise<Response> {
  return new Response(JSON.stringify(prmBody(req)), {
    status: 200,
    headers: {
      ...corsHeaders(req),
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
    },
  });
}

export function OPTIONS(req: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

