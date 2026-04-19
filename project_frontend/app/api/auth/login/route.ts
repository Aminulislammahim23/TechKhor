import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:3000";

const getErrorMessage = (payload: unknown): string => {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    Array.isArray(payload.message) &&
    typeof payload.message[0] === "string"
  ) {
    return payload.message[0];
  }

  return "Login failed";
};

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string } | null = null;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 },
    );
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${BACKEND_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Cannot reach backend auth service" },
      { status: 503 },
    );
  }

  const payload = await backendResponse.json().catch(() => null);
  if (!backendResponse.ok) {
    return NextResponse.json(
      { message: getErrorMessage(payload) },
      { status: backendResponse.status },
    );
  }

  const accessToken =
    payload &&
    typeof payload === "object" &&
    "access_token" in payload &&
    typeof payload.access_token === "string"
      ? payload.access_token
      : null;

  if (!accessToken) {
    return NextResponse.json(
      { message: "Invalid auth response from backend" },
      { status: 502 },
    );
  }

  const response = NextResponse.json(
    { message: "Login successful" },
    { status: 200 },
  );

  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}
