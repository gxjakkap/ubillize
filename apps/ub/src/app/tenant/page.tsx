import { auth, signOut } from "@/auth"
import { BillsTable } from "@/components/tenant/bills-table"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { db } from "@ubillize/db"
import { tenant, bills } from "@ubillize/db/schema"
import { and, eq } from "@ubillize/db/orm"


export default async function TenantPage(){
    const signOutAction = async() => {
        "use server"
        await signOut({ redirectTo: '/login' })
    }

    const session = await auth()

    if (!session){
      return
    }

    const [tenantData] = await db.select().from(tenant).where(eq(tenant.id, session.user.id)).limit(1)
    const billsData = await db.select().from(bills).where(and(eq(bills.roomNo, tenantData.roomNo!), eq(bills.archiveStatus, false)))

    return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary ml-4">Ubillize</h1>
            </div>
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" className="text-lg">Sign Out</Button>
            </form>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Tenant Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg"><strong>Name:</strong> {`${tenantData.name} ${tenantData.surname}`}</p>
              <p className="text-lg"><strong>Room Number:</strong> {tenantData.roomNo}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <BillsTable billsData={billsData} />
              </div>
            </CardContent>
          </Card>
        </div>
    )
}