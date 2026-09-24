import NextAuth from "next-auth";
import { authOptions, authSecret } from "@/lib/auth";

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = authSecret;
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

