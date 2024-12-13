import { relations } from "drizzle-orm/relations";
import { users, session, tenant, authenticator, account } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(users, {
		fields: [session.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	sessions: many(session),
	tenants: many(tenant),
	authenticators: many(authenticator),
	accounts: many(account),
}));

export const tenantRelations = relations(tenant, ({one}) => ({
	user: one(users, {
		fields: [tenant.id],
		references: [users.id]
	}),
}));

export const authenticatorRelations = relations(authenticator, ({one}) => ({
	user: one(users, {
		fields: [authenticator.userId],
		references: [users.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(users, {
		fields: [account.userId],
		references: [users.id]
	}),
}));