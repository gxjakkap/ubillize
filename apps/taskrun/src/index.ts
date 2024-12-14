import { db } from "@ubillize/db"
import { accounts, bills, tasks, tenant, users } from "@ubillize/db/schema"
import { eq, asc, sql } from "@ubillize/db/orm"
import { BillAlert, BillCanceledAlert, BillPaidAlert, BillUpdatedAlert, sendMessage } from "@ubillize/msg"
import Bottleneck from "bottleneck"


const limiter = new Bottleneck({ minTime: 100, maxConcurrent: 10 })
async function processTask(){
    try {
        const res = await db.execute(
            sql`
            SELECT * FROM tasks
            WHERE status='pending'
            ORDER BY "scheduledAt" ASC
            LIMIT 10
            FOR UPDATE SKIP LOCKED`
        )
        
        if (!res.rowCount || res.rowCount < 1) return // skip task when there's no job pending
        const tasksRes = res.rows

        tasksRes.forEach((task) => {
            limiter.schedule(async() => {
                try {
                    const recipient = task['to']
                    if (task['type'] === 'bill_alert'){
                        const userData = await db.select().from(tenant).where(eq(tenant.roomNo, recipient as string)).leftJoin(accounts, eq(tenant.id, accounts.userId))
                        const billId = task['ref']
                        const [bill] = await db.select().from(bills).where(eq(bills.id, parseInt(billId as string))).limit(1)
                        userData.forEach(async(u) => {
                            await sendMessage(BillAlert(bill), process.env.LINE_CHANNEL_ACCESS_TOKEN!, u.account?.providerAccountId as string)
                        })
                        await db.update(tasks).set({ status: 'done' }).where(eq(tasks.id, task['id'] as number))
                    }
                    else if (task['type'] === 'bill_paid'){
                        const userData = await db.select().from(tenant).where(eq(tenant.roomNo, recipient as string)).leftJoin(accounts, eq(tenant.id, accounts.userId))
                        const billId = task['ref']
                        const [bill] = await db.select().from(bills).where(eq(bills.id, parseInt(billId as string))).limit(1)
                        userData.forEach(async(u) => {
                            await sendMessage(BillPaidAlert(bill), process.env.LINE_CHANNEL_ACCESS_TOKEN!, u.account?.providerAccountId as string)
                        })
                        await db.update(tasks).set({ status: 'done' }).where(eq(tasks.id, task['id'] as number))
                    }
                    else if (task['type'] === 'bill_updated'){
                        const userData = await db.select().from(tenant).where(eq(tenant.roomNo, recipient as string)).leftJoin(accounts, eq(tenant.id, accounts.userId))
                        const billId = task['ref']
                        const [bill] = await db.select().from(bills).where(eq(bills.id, parseInt(billId as string))).limit(1)
                        userData.forEach(async(u) => {
                            await sendMessage(BillUpdatedAlert(bill), process.env.LINE_CHANNEL_ACCESS_TOKEN!, u.account?.providerAccountId as string)
                        })
                        await db.update(tasks).set({ status: 'done' }).where(eq(tasks.id, task['id'] as number))
                    }
                    else if (task['type'] === 'bill_canceled'){
                        const userData = await db.select().from(tenant).where(eq(tenant.roomNo, recipient as string)).leftJoin(accounts, eq(tenant.id, accounts.userId))
                        const billId = task['ref']
                        userData.forEach(async(u) => {
                            await sendMessage(BillCanceledAlert(u.tenant.roomNo as string, parseInt(billId as string)), process.env.LINE_CHANNEL_ACCESS_TOKEN!, u.account?.providerAccountId as string)
                        })
                        await db.update(tasks).set({ status: 'done' }).where(eq(tasks.id, task['id'] as number))
                    }
                    /* else if (task['type'] === 'welcome'){

                        await db.update(tasks).set({ status: 'done' }).where(eq(tasks.id, task['id'] as number))
                    } */
                }
                catch (err){
                    await db.update(tasks).set({ status: 'failed' }).where(eq(tasks.id, task['id'] as number))
                    console.log("ERR: Task #", task['id'], "failed!: ", err)
                }
            })
        })
        
    }
    catch (err){
        console.error(err)
    }
}

setInterval(processTask, 3000)