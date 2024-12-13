"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export interface LoginData {
    email: string,
    password: string
}

export const staffSignIn = async(data: LoginData, callbackUrl: string | null) => {
    const { email, password } = data
    try {
        await signIn('credentials', {
            redirectTo: callbackUrl ?? '/staff',
            email,
            password
        })
    }
    catch (err){
        if (err instanceof AuthError) {
            return false
        }
        throw err
    }
    return true
}