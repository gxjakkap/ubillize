"use server"
import { db } from "@ubillize/db"
import { users, tenant } from "@ubillize/db/schema"
import { eq } from "@ubillize/db/orm"

import { auth } from "@/auth"
import { TenantAppRoles } from "@/lib/const"
import { checkRoles } from "@/lib/roles"

interface OnboardingActionProps {
    id: string,
    name: string,
    surname: string,
    email: string,
    roomNo: string
}

interface Tenant {
    id: string,
    name: string | null,
    surname: string | null,
    email: string | null,
    roomNo: string | null,
    finishedOnboarding: boolean
}

export const onboardTenant = async ({ id, name, surname, email, roomNo }: OnboardingActionProps) => {
    const session = await auth()
    if (!session || !checkRoles(session.user.role, TenantAppRoles)){
        return { status: 403, err: 'forbidden' }
    }
    const data: Tenant = {
        id,
        name,
        surname,
        email,
        roomNo,
        finishedOnboarding: true
    }
    const alreadyExisted = (await db.select().from(tenant).where(eq(tenant.id, id)).limit(1)).length !== 0
    if (alreadyExisted) return { status: 400, err: 'id already existed!' }

    const notRegistered = (await db.select().from(users).where(eq(users.id, id)).limit(1)).length !== 1
    if (notRegistered) return { status: 400, err: 'users not registered via line yet!' }

    /* const updatedUserId: { updatedId: string }[] = await db.update(tenant).set(data).where(eq(tenant.id, id)).returning({ updatedId: tenant.id }) */
    const updatedUserId = await db.insert(tenant).values(data).returning({ id: tenant.id })
    console.log(updatedUserId)
    return { status: 200, updated: updatedUserId[0].id }
}