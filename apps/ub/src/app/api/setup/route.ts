import { db } from "@ubillize/db"
import { settings, staff, users } from "@ubillize/db/schema"
import { eq } from "@ubillize/db/orm"
import { NextResponse } from "next/server"
import { genSalt } from "bcryptjs"
import { hashPassword } from "@/lib/auth/password"

export async function POST(req: Request) {
    const body = await req.json()
    const alreadySetUp = await db.select().from(settings).where(eq(settings.key, 'hasSetUp')).limit(1)
    if (alreadySetUp.length > 0 && parseInt(alreadySetUp[0].val || "0") === 1){
        console.log("already setup")
        return new NextResponse(JSON.stringify({ status: 403 }), { status: 403 })
    }
    console.log(body)
    if (!body || !body.osvtk){
        console.log("no body or no valid tk")
        return new NextResponse(JSON.stringify({ status: 403 }), { status: 403 })
    }
    
    if (body.osvtk !== process.env.OSV_TOKEN){
        console.log("setup token missmatch")
        return new NextResponse(JSON.stringify({ status: 403 }), { status: 403 })
    }

    if (!body.em || !body.pw){
        return new NextResponse(JSON.stringify({ status: 400 }), { status: 400 })
    }

    const id = crypto.randomUUID()

    const collision = (await db.select().from(users).where(eq(users.id, id))).length > 0

    if (collision){
        // 1 in a billion chance that uuid failed me. just gonna tell client to try again
        return { status: 500, err: 'id collision' }
    }

    const salt = await genSalt(12)
    const pwHash = await hashPassword(body.pw, salt)

    const rs: typeof staff.$inferInsert = {
        email: body.em,
        displayName: 'Root Account',
        passHash: pwHash,
        id: id
    }

    const ru: typeof users.$inferInsert = {
        id: id,
        name: 'Root Account',
        email: body.em,
        role: 'admin'
    }

    await db.insert(users).values(ru)
    await db.insert(staff).values(rs)

    //await db.update(settings).set({ val: '1' }).where(eq(settings.key, 'hasSetUp'))
    await db.insert(settings).values({ key: 'hasSetUp', val: '1' })
    await db.insert(settings).values({ key: 'receivingBankAccNum', val: null })
    await db.insert(settings).values({ key: 'receivingBankId', val: null })

    return new NextResponse(JSON.stringify({ status: 201 }), { status: 201 })
}

export async function GET() {
    const alreadySetUp = await db.select().from(settings).where(eq(settings.key, 'hasSetUp')).limit(1)
    console.log(alreadySetUp)
    if (alreadySetUp.length > 0 && parseInt(alreadySetUp[0].val || "0") === 1){
        return new NextResponse(JSON.stringify({ v: true }))
    }
    else {
        return new NextResponse(JSON.stringify({ v: false }))
    }
}