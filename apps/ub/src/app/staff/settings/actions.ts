"use server"

import { genSalt } from "bcryptjs"
import { db } from "@ubillize/db"
import { settings, staff, users } from "@ubillize/db/schema"
import { eq, InferInsertModel } from "@ubillize/db/orm"

import { auth } from "@/auth"
import { hashPassword } from "@/lib/auth/password"
import { AdminAppRoles } from "@/lib/const"
import { checkRoles } from "@/lib/roles"

export async function updateSettings({ key, nVal }: { key: string, nVal: string | null }){
    const session = await auth()
    if (!session || !checkRoles(session.user.role, AdminAppRoles)){
        return { status: 403, err: 'forbidden' }
    }
    console.log(`key: ${key}, nval: ${nVal}`)
    const updatedVal: Partial<typeof settings.$inferSelect> = {
        val: nVal
    }
    const [updatedSettings] = await db.update(settings).set(updatedVal).where(eq(settings.key, key)).returning({ key: settings.key, val: settings.val })
    return { status: 200, updated: updatedSettings }
}

export async function addStaffAccount(data: { name: string, role: "staff" | "admin", email: string, password: string,}) {
    const session = await auth()
    if (!session || !checkRoles(session.user.role, AdminAppRoles)){
        return { status: 403, err: 'forbidden' }
    }

    // im gonna trust the uniqueness in uuid for this one
    const id = crypto.randomUUID()

    const collision = (await db.select().from(users).where(eq(users.id, id))).length > 0

    if (collision){
        // 1 in a billion chance that uuid failed me. just gonna tell client to try again
        return { status: 500, err: 'id collision' }
    }

    const salt = await genSalt(12)
    const pwHash = await hashPassword(data.password, salt)

    const rs: typeof staff.$inferInsert = {
        email: data.email,
        displayName: data.name,
        passHash: pwHash,
        id: id
    }

    const ru: typeof users.$inferInsert = {
        id: id,
        name: data.name,
        email: data.email,
        role: data.role
    }

    const [utr] = await db.insert(users).values(ru).returning({ id: users.id, role: users.role })
    const [str] = await db.insert(staff).values(rs).returning({ id: staff.id })

    if (utr.id !== str.id){
        console.error("ERR: id missmatch! users: ", users.id, " staff: ", staff.id)
        return { status: 500, err: 'id missmatch'}
    }
    return { status: 201 }
}

export async function editStaffAccount(data: Partial<{ name: string, role: "staff" | "admin", email: string, password: string,}>, id: string) {
    const session = await auth()
    if (!session || !checkRoles(session.user.role, AdminAppRoles)){
        return { status: 403, err: 'forbidden' }
    }

    const existed = (await db.select().from(users).where(eq(users.id, id))).length > 0

    if (!existed){
        return { status: 400, err: 'account does not exist' }
    }

    console.log(data)

    const rs: Partial<InferInsertModel<typeof staff>> = {}
    const ru: Partial<InferInsertModel<typeof users>> = {}

    if (data.name){
        rs.displayName = data.name
        ru.name = data.name
    }

    if (data.email){
        rs.email = data.email
        ru.email = data.email
    }

    if (data.password){
        const salt = await genSalt(12)
        const pwHash = await hashPassword(data.password, salt)
        rs.passHash = pwHash
    }

    if (data.role){
        ru.role = data.role
    }

    await db.update(users).set(ru).where(eq(users.id, id))
    await db.update(staff).set(rs).where(eq(staff.id, id))

    /* const [utr] = await db.insert(users).values(ru).returning({ id: users.id, role: users.role })
    const [str] = await db.insert(staff).values(rs).returning({ id: staff.id }) */

    /* if (utr.id !== str.id){
        console.error("ERR: id missmatch! users: ", users.id, " staff: ", staff.id)
        return { status: 500, err: 'id missmatch'}
    } */
    return { status: 200 }
}

export async function deleteStaffAccount(id: string){
    const session = await auth()
    if (!session || !checkRoles(session.user.role, AdminAppRoles)){
        return { status: 403, err: 'forbidden' }
    }

    await db.delete(staff).where(eq(staff.id, id))
    await db.delete(users).where(eq(users.id, id))
}