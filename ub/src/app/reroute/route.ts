import { AppRoles, StaffAppRoles, TenantAppRoles } from '@/lib/const'
import { redirect } from 'next/navigation'
import { NextResponse, type NextRequest } from 'next/server'

export const GET = (req: NextRequest) => {
    const destination = req.nextUrl.searchParams.get('d')
    const validRoles = [...new Set([...TenantAppRoles, ...StaffAppRoles])]

    if (!validRoles.includes(destination as never)){
        return new NextResponse(JSON.stringify({ status: 500, err: 'invalid role!' }), { status: 500 })
    }

    switch (destination){
        case AppRoles.Tenant:
            redirect('/tenant')
        case AppRoles.Staff:
            redirect('/staff')
        case AppRoles.Admin:
            redirect('/staff')
    }
}