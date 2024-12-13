import { json, primaryKey, serial } from "drizzle-orm/pg-core"
import { date, pgTable, real, text, timestamp, varchar, boolean, integer } from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"

export const tenant = pgTable('tenant', {
    id: varchar('id', { length: 50 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text('name'),
    surname: text('surname'),
    email: text('email').unique(),
    roomNo: varchar('roomNo', { length: 10 }),
    finishedOnboarding: boolean('finishedOnboarding').notNull().default(false)
})

export const tasks = pgTable('tasks', {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    type: varchar('type', { length: 50 }).notNull(),
    to: text('to'),
    ref: text('ref'),
    scheduledAt: timestamp('scheduledAt', { withTimezone: true }).defaultNow().notNull(),
    status: varchar('status', { length: 20 }).default('pending')
})

export const bills = pgTable('bills', {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    dateAdded: timestamp('dateAdded', { withTimezone: true }).defaultNow().notNull(),
    dateDue: date('dateDue', { mode: 'date' }).notNull(),
    electUnit: real('electUnit'),
    waterUnit: real('waterUnit'),
    electDueAmount: real('electDueAmount'),
    waterDueAmount: real('waterDueAmount'),
    rentDueAmount: real('rentDueAmount').notNull(),
    totalDueAmount: real('totalDueAmount').notNull(),
    paid: boolean('paid').default(false).notNull(),
    paidDate: timestamp('paidDate'),
    payer: text('payer'),
    slip: text('slip'),
    addedBy: text('addedBy'),
    archiveStatus: boolean('archiveStatus').default(false).notNull(),
    archiveDate: timestamp('archiveDate'),
    osvData: json('osvData'),
    roomNo: varchar('roomNo', { length: 10 }).notNull()
})

export const staff = pgTable('staff', {
    id: varchar('id', { length: 50 }).notNull().unique().primaryKey().references(() => users.id, { onDelete: "cascade" }),
    email: text('email').unique().notNull(),
    passHash: varchar('passHash', { length: 100 }).notNull(),
    displayName: text('displayName').notNull()
})

export const settings = pgTable('settings', {
    id: serial('id').primaryKey(),
    key: varchar('key', { length: 50 }).unique().notNull(),
    val: text('val')
})

export const users = pgTable('users', {
    id: varchar('id', { length: 50 }).notNull().primaryKey(),
    name: text('name'),
    email: text('email').unique(),
    emailVerified: timestamp('emailVerified', { withTimezone: true }),
    image: text('image'),
    role: text("role").notNull().default('tenant')
})

export const accounts = pgTable("account", {
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
)
   
export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})
   
export const verificationTokens = pgTable("verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
)
   
export const authenticators = pgTable("authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
    },
    (authenticator) => ({
        compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
        }),
    })
)