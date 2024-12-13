import { pgTable, unique, varchar, text, timestamp, uuid, integer, date, real, boolean, json, foreignKey, serial, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: varchar({ length: 50 }).primaryKey().notNull(),
	name: text(),
	email: text(),
	emailVerified: timestamp({ withTimezone: true, mode: 'string' }),
	image: text(),
	role: text().default('tenant').notNull(),
}, (table) => {
	return {
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});

export const staff = pgTable("staff", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	passHash: varchar({ length: 100 }).notNull(),
	displayName: text().notNull(),
}, (table) => {
	return {
		staffEmailUnique: unique("staff_email_unique").on(table.email),
	}
});

export const bills = pgTable("bills", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "bills_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	dateAdded: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	dateDue: date().notNull(),
	electUnit: real(),
	waterUnit: real(),
	electDueAmount: real(),
	waterDueAmount: real(),
	rentDueAmount: real().notNull(),
	totalDueAmount: real().notNull(),
	paid: boolean().default(false).notNull(),
	slip: text(),
	archiveStatus: boolean().default(false).notNull(),
	roomNo: varchar({ length: 10 }).notNull(),
	paidDate: timestamp({ mode: 'string' }),
	payer: text(),
	addedBy: text(),
	archiveDate: timestamp({ mode: 'string' }),
	osvData: json(),
});

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => {
	return {
		sessionUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "session_userId_users_id_fk"
		}).onDelete("cascade"),
	}
});

export const tenant = pgTable("tenant", {
	id: varchar({ length: 50 }).notNull(),
	name: text(),
	surname: text(),
	email: text(),
	roomNo: varchar({ length: 10 }),
	finishedOnboarding: boolean().default(false).notNull(),
}, (table) => {
	return {
		tenantIdUsersIdFk: foreignKey({
			columns: [table.id],
			foreignColumns: [users.id],
			name: "tenant_id_users_id_fk"
		}).onDelete("cascade"),
		tenantEmailUnique: unique("tenant_email_unique").on(table.email),
	}
});

export const settings = pgTable("settings", {
	id: serial().primaryKey().notNull(),
	key: varchar({ length: 50 }),
	val: text(),
});

export const verificationToken = pgTable("verificationToken", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => {
	return {
		verificationTokenIdentifierTokenPk: primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk"}),
	}
});

export const authenticator = pgTable("authenticator", {
	credentialId: text().notNull(),
	userId: text().notNull(),
	providerAccountId: text().notNull(),
	credentialPublicKey: text().notNull(),
	counter: integer().notNull(),
	credentialDeviceType: text().notNull(),
	credentialBackedUp: boolean().notNull(),
	transports: text(),
}, (table) => {
	return {
		authenticatorUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "authenticator_userId_users_id_fk"
		}).onDelete("cascade"),
		authenticatorUserIdCredentialIdPk: primaryKey({ columns: [table.credentialId, table.userId], name: "authenticator_userId_credentialID_pk"}),
		authenticatorCredentialIdUnique: unique("authenticator_credentialID_unique").on(table.credentialId),
	}
});

export const account = pgTable("account", {
	userId: text().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => {
	return {
		accountUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "account_userId_users_id_fk"
		}).onDelete("cascade"),
		accountProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"}),
	}
});
