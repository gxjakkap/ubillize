import { redirect } from "next/navigation"

import { auth, signOut } from "@/auth"
import { checkRoles } from "@/lib/roles"
import { AdminAppRoles, StaffAppRoles } from "@/lib/const"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function StaffLayout({ children }: Readonly<{children: React.ReactNode;}>){
    const session = await auth()
    if (!session){
        redirect(`/login/staff?callbackUrl=${encodeURIComponent('/staff')}`)
    }

    if (!checkRoles(session.user.role, StaffAppRoles)) redirect(`/reroute?d=${session.user.role}`)

    const signOutAction = async() => {
        "use server"
        await signOut({ redirectTo: '/login/staff' })
    }

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-primary ml-4">Ubillize</h1>
                        </div>
                        
                        <div className="inline-flex gap-x-6 items-center">
                            <Link href={'/staff'} className="text-lg">Home</Link>
                            {(checkRoles(session.user.role, AdminAppRoles)) && (
                                <Link href={'/staff/settings'} className="text-lg">Settings</Link>
                            )}
                            <form action={signOutAction}>
                                <Button type="submit" variant="ghost" className="text-lg">Sign Out</Button>
                            </form>
                        </div>
                    </div>
                    { children }
                </div>
            </div>
        </>
    )
}