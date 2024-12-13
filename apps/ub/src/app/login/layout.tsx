import { auth } from "@/auth"
import { redirect } from "next/navigation"


export default async function LoginLayout({ children }: Readonly<{children: React.ReactNode;}>){
    const session = await auth()
    if (session){
        if (session.user.role === "staff") redirect('/staff')
        else redirect('/tenant')
    }
    return (
        <div className="flex min-h-screen justify-center">
            <div className="flex flex-col gap-16">
                { children }
            </div>
        </div>
    )
}