import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validUsername || !validPassword) {
      return NextResponse.json({ message: "Admin credentials not configured in `.env`" }, { status: 500 });
    }

    if (username === validUsername && password === validPassword) {
      // Set an auth cookie
      const cookieStore = await cookies();
      cookieStore.set("admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
