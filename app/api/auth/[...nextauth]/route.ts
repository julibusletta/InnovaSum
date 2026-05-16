import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "dummy",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "dummy",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Specific Admin access
        if (credentials.email === 'admin' && credentials.password === 'Deporte$1993') {
          return {
            id: 'admin',
            email: 'admin',
            name: 'Administrador',
            role: 'ADMIN',
          } as any;
        }

        const user = await db.getUserByEmail(credentials.email);
        if (!user || !user.password) return null;
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        
        return {
          id: user.email,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role || 'USER',
          dni: user.dni,
          address: user.address,
        } as any;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        if (!user.email) return false;
        const existingUser = await db.getUserByEmail(user.email);
        if (!existingUser) {
          const nameParts = (user.name || "").split(" ");
          const firstName = nameParts[0] || "Usuario";
          const lastName = nameParts.slice(1).join(" ") || "";
          
          await db.saveUser({
            email: user.email,
            firstName,
            lastName,
            role: "USER",
            image: user.image,
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        if (account?.provider === "google" || account?.provider === "facebook") {
          const dbUser = await db.getUserByEmail(user.email);
          if (dbUser) {
            token.role = dbUser.role || "USER";
            token.dni = dbUser.dni;
            token.address = dbUser.address;
          }
        } else {
          token.role = user.role;
          token.dni = user.dni;
          token.address = user.address;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).dni = token.dni;
        (session.user as any).address = token.address;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
