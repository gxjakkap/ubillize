
import { signIn } from "@/auth"
import { LineIcon } from "@/components/svg/line"
import { Button } from "@/components/ui/button"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

export default async function Login(props: {searchParams: { callbackUrl: string | undefined }}){
    const pr = await props.searchParams
    return (
        <>
            <div className="flex flex-col gap-y-12 mt-[25vh]">
                <h1 className="text-5xl text-center text-black prompt-bold">Login</h1>
                <div className="flex flex-col gap-y-2">
                    <form 
                        action={async () => {
                            "use server"
                            try {
                                await signIn('line', {
                                    redirectTo: pr.callbackUrl ?? "/tenant",
                                })
                            } 
                            catch (error) {
                                // Signin can fail for a number of reasons, such as the user
                                // not existing, or the user not having the correct role.
                                // In some cases, you may want to redirect to a custom error
                                if (error instanceof AuthError) {
                                    return redirect(`/err?error=${error.type}`)
                                }
                    
                                // Otherwise if a redirects happens Next.js can handle it
                                // so you can just re-thrown the error and let Next.js handle it.
                                // Docs:
                                // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                                throw error
                            }
                        }} 
                        className="flex flex-col"
                    >
                        <Button className="bg-[#00b900]" type="submit"> <LineIcon className="w-8 h-8 text-white" /> Log in with Line</Button>
                    </form>
                </div>
            </div>
        </>
    )
}