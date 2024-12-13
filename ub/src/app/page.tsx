import { auth } from "@/auth"
import { StaffAppRoles, TenantAppRoles } from "@/lib/const"
import { checkRoles } from "@/lib/roles"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()
  if (session){
    if (checkRoles(session.user.role, StaffAppRoles)){
      redirect(`/staff`)
    }
    else if (checkRoles(session.user.role, TenantAppRoles)){
      redirect(`/tenant`)
    }
  }
  redirect('https://line.me/R/ti/p/@882bbmym')
}
