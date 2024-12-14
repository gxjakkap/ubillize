'use server'

import { auth } from "@/auth"
import { StaffAppRoles } from "@/lib/const"
import { checkRoles } from "@/lib/roles"
import { db } from "@ubillize/db"
import { InferInsertModel } from "@ubillize/db/orm"
import { bills, tasks } from "@ubillize/db/schema"

interface BillDataEach {
    room: string;
    electricity: string;
    water: string;
    rent: string;
    dueDate: Date;
}

export async function addBills(data: BillDataEach[]) {
    const session = await auth()
    if (!session || !checkRoles(session.user.role, StaffAppRoles)) return { status: 403 }

    const billsRowData: InferInsertModel<typeof bills>[] = data.map((b) => {
        const e = parseInt(b.electricity)
        const w = parseInt(b.water)
        const r = parseInt(b.rent)
        
        return {
            dateDue: b.dueDate,
            roomNo: b.room,
            electDueAmount: e,
            waterDueAmount: w,
            rentDueAmount: r,
            totalDueAmount: e + w + r,
            addedBy: session.user.id
        }
    })

    const res = await db.insert(bills).values(billsRowData).returning({ id: bills.id, roomNo: bills.roomNo })

    const tasksRowData: InferInsertModel<typeof tasks>[] = res.map((r) => {
        return {
            type: 'bill_alert',
            to: r.roomNo,
            ref: r.id.toString()
        }
    })
    await db.insert(tasks).values(tasksRowData)
    return { status: 201 }
}