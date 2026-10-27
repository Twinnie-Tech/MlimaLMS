import { NextResponse, type NextRequest } from "next/server";
import { toNextJsHandler } from "better-auth/next-js";

import { protectAuthRequest } from "@/lib/arcjet";
import { auth } from "@/lib/auth";

const handlers = toNextJsHandler(auth);

async function readEmail(req: NextRequest) {
  try {
    const body = await req.clone().json();
    return typeof body?.email === "string" ? body.email : undefined;
  } catch {
    return undefined;
  }
}

async function guard(req: NextRequest, handler: (req: NextRequest) => Promise<Response>) {
  const email = req.method === "POST" ? await readEmail(req) : undefined;
  const result = await protectAuthRequest(req, req.nextUrl.pathname, email);

  if (result.denied) {
    // Same shape as Better Auth errors so the client shows `message` in its toast.
    return NextResponse.json(
      { code: "REQUEST_BLOCKED", message: result.message },
      { status: result.status }
    );
  }
  return handler(req);
}

export const GET = (req: NextRequest) => guard(req, handlers.GET);
export const POST = (req: NextRequest) => guard(req, handlers.POST);
