
import { db } from "@ubillize/db"
import { settings, staff, users } from "@ubillize/db/schema"
import { eq } from "@ubillize/db/orm"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { AdminAppRoles } from "@/lib/const"
import { checkRoles } from "@/lib/roles"
import { BankIdConverter } from "@/components/staff/settings/bankidconverter"
import { SettingsKeyValEditor } from "@/components/staff/settings/keyvaleditor"
import { StaffUsersTable } from "@/components/staff/settings/staffs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default async function SettingsPage(){
    const session = await auth()

    if (!session){
      return
    }
    
    if (!checkRoles(session.user.role, AdminAppRoles)) redirect(`/reroute?d=${session.user.role}`)
    
    const staffsData = await db.select().from(staff).leftJoin(users, eq(staff.id, users.id))
    const [adminData] = staffsData.filter(d => {
        return (d.staff.id === session.user.id) && (d.users?.role === 'admin')
    })

    if (!adminData){
        return
    }

    const settingsData = await db.select().from(settings)

    return (
        <>
            <div className="flex flex-col gap-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">App settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg"><strong>Hi!</strong> {`${adminData.staff.displayName} (${adminData.staff.email})`}</p>
                        <p className="font-medium text-lg pt-4">Ref:</p>
                        <div className="inline-flex gap-x-2 items-center">BankId: <BankIdConverter /></div>
                    </CardContent>
                </Card>
                <SettingsKeyValEditor settingsData={settingsData} />
                <StaffUsersTable data={staffsData} />
            </div>
        </>
    )
}