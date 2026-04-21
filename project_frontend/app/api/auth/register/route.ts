import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:5005";
const ALLOWED_ROLES = new Set(["customer", "seller"]);

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

  return "Registration failed";
};

export async function POST(request: NextRequest) {
  let body:
    | {
        fullName?: string;
        email?: string;
        password?: string;
        role?: string;
      }
    | null = null;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const role = body?.role ?? "customer";
  if (!ALLOWED_ROLES.has(role)) {
    return NextResponse.json(
      { message: "Role must be customer or seller" },
      { status: 400 },
    );
  }

  if (!body?.fullName || !body?.email || !body?.password) {
    return NextResponse.json(
      { message: "Full name, email, and password are required" },
      { status: 400 },
    );
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${BACKEND_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: body.fullName,
        email: body.email,
        password: body.password,
        role,
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

  return NextResponse.json(
    { message: "Registration successful" },
    { status: 201 },
  );
}
