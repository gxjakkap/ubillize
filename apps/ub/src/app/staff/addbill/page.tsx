import { AddBillTable } from "@/components/staff/addbill/bill-adding-table"
import { db } from "@ubillize/db"
import { tenant } from "@ubillize/db/schema"

export default async function AddBillPage() {
    const tenantList = await db.select({ roomNo: tenant.roomNo }).from(tenant).orderBy(tenant.roomNo)
    const rooms = [...new Set(
        tenantList
          .map((obj) => obj.roomNo)
          .filter((roomNo) => roomNo !== null)
    )]
    return (
        <AddBillTable rooms={rooms} />
    )
}