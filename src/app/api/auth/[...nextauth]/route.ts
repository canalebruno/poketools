import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
})
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // Add any other configuration arrays/callbacks you had before here
};

const handler = NextAuth(authOptions);

// Next.js App Router expects explicit HTTP method exports
export { handler as GET, handler as POST };