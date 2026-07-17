import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@coursepro.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
        
        // Check if the provided credentials match the environment variables
        if (credentials.email === adminEmail && credentials.password === adminPassword) {
          return {
            id: "admin-id",
            name: "Admin User",
            email: credentials.email,
            role: "admin",
          };
        }
        
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    // signIn: '/login', // Uncomment and set to your custom login page route if you have one
  }
};
