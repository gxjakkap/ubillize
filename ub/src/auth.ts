import NextAuth, { type DefaultSession } from "next-auth"
import Line from "next-auth/providers/line"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@ubillize/db"
import { users, accounts, sessions, verificationTokens, staff } from "@ubillize/db/schema"
import { eq } from "@ubillize/db/orm"

import { checkPassword } from "@/lib/auth/password"

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role?: string;
        } & DefaultSession["user"]
    }
    
    interface User {
        id?: string;
        role?: string;
    }
}

const LineProvider = Line({
    clientId: process.env.AUTH_LINE_ID,
    clientSecret: process.env.AUTH_LINE_SECRET,
    checks: ["state"],
})

const CredentialsProvider = Credentials({
    id: 'credentials',
    name: 'Credentials',
    credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
        const data = await db.select().from(staff).where(eq(staff.email, credentials.email as string)).limit(1)
        if (data.length < 1){
            console.log('No staff found for email:', credentials.email)
            return null
        }
        const u = data[0]
        const isPwMatch = await checkPassword(credentials.password as string, u.passHash)
        if (!isPwMatch) return null

        return {
            name: u.displayName,
            role: 'staff',
            email: u.email,
            id: u.id
        }
    },
    
})
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
      }),
    providers: [
        LineProvider,
        CredentialsProvider
    ],
    pages: {
        signIn: '/login'
    },
    callbacks: {
        /* signIn: async ({ user }) => {
            // If it's a new user, set default role
            if (!user.role) {
                user.role = "tenant"
            }
            return true
        }, */
        async jwt({ token, user, trigger, session }) {
            // Persist the role and id in the JWT on login
            if (user) {
                token.id = user.id
                token.role = user.role || 'tenant'
                token.email = user.email
                token.name = user.name
            }

            // Handle manual update of session
            if (trigger === 'update') {
                return { ...token, ...session }
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                const [qres] = await db.select({ role: users.role }).from(users).where(eq(users.id, token.sub || '')).limit(1)
                session.user.id = token.sub || ''
                session.user.role = qres.role || 'tenant'
                session.user.email = token.email || session.user.email
                session.user.name = token.name || session.user.name
            }

            return session
        }
    },
    events: {
        async signIn(message) {
            console.log('Sign In Event:', message)
        }
    },
    session: {
        maxAge: 60 * 60 * 24,
        strategy: 'jwt', 
    },
    debug: process.env.NODE_ENV === 'development'
})