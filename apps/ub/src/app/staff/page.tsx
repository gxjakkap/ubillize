import { auth } from "@/auth"
import { StaffBillsTable } from "@/components/staff/bills-table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { db } from "@ubillize/db"
import { eq } from "@ubillize/db/orm"
import { staff, bills } from "@ubillize/db/schema"

export default async function StaffMainPage(){
    const session = await auth()

    if (!session){
      return
    }

    const [staffData] = await db.select().from(staff).where(eq(staff.id, session.user.id)).limit(1)
    const billsData = await db.select().from(bills)
    return (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Staff Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg"><strong>Hi!</strong> {`${staffData.displayName} (${staffData.email})`}</p>
            </CardContent>
          </Card>
          <StaffBillsTable billsData={billsData} />
        </>
    )
}