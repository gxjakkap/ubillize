import { redirect } from "next/navigation"
import { db } from "@ubillize/db"
import { tenant } from "@ubillize/db/schema"
import { eq } from "@ubillize/db/orm"

import { auth } from "@/auth"
import { checkRoles } from "@/lib/roles"
import { TenantAppRoles } from "@/lib/const"

export default async function OnboardingLayout({ children }: Readonly<{children: React.ReactNode;}>){
    const session = await auth()

    if (!session){
        redirect('/login')
    }

    if (!checkRoles(session.user.role, TenantAppRoles)) redirect(`/reroute?d=${session.user.role}`)

    const finishedOnboarding = (await db.select().from(tenant).where(eq(tenant.id, session.user.id)).limit(1)).length === 1

    if (finishedOnboarding){
        redirect('/tenant')
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-16">
                { children }
            </div>
        </div>
    )
}