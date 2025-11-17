import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const publicPaths = ["/login", "/sign-in"];

  if (publicPaths.includes(pathname) && !token) {
    return NextResponse.next();
  }

  if (publicPaths.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!publicPaths.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const res = await fetch("http://localhost:8000/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const resp = NextResponse.redirect(new URL("/login", request.url));
      resp.cookies.delete("token");
      return resp;
    }
  } catch (e) {
    const resp = NextResponse.redirect(new URL("/login", request.url));
    resp.cookies.delete("token");
    return resp;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
