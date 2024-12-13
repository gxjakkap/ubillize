import { AppRoles } from "./const"

export const checkRoles = (sessionRole: string|null|undefined, appRoles: AppRoles[]) => {
    if (!sessionRole) return false
    return appRoles.includes(sessionRole as never)
}