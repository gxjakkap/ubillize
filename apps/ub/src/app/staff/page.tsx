import { auth } from "@/auth"
import { StaffBillsTable } from "@/components/staff/bills-table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { db } from "@ubillize/db"
import { eq } from "@ubillize/db/orm"
import { staff, bills, users } from "@ubillize/db/schema"

const capitalizeFirstLetter = (s: string) => {
  const a = s.split('')
  a[0] = a[0].toUpperCase()
  return a.join('')
}

export default async function StaffMainPage(){
    const session = await auth()

    if (!session){
      return
    }

    const [staffData] = await db.select().from(staff).where(eq(staff.id, session.user.id)).leftJoin(users, eq(staff.id, staff.id)).limit(1)
    const billsData = await db.select({ id: bills.id, dateAdded: bills.dateAdded, dateDue: bills.dateDue, electDueAmount: bills.electDueAmount, waterDueAmount: bills.waterDueAmount, rentDueAmount: bills.rentDueAmount, totalDueAmount: bills.totalDueAmount, paid: bills.paid, paidDate: bills.paidDate, payer: bills.payer, slip: bills.slip, addedBy: bills.addedBy, addedByName: staff.displayName, addedByMail: staff.email, archiveStatus: bills.archiveStatus, archiveDate: bills.archiveDate, osvData: bills.osvData, roomNo: bills.roomNo }).from(bills).leftJoin(staff, eq(bills.addedBy, staff.id))
    return (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Staff Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg"><strong>Hi!</strong> [{capitalizeFirstLetter(staffData.users?.role as string)}] {`${staffData.staff.displayName} (${staffData.staff.email})`}</p>
            </CardContent>
          </Card>
          <StaffBillsTable billsData={billsData} />
        </>
    )
}