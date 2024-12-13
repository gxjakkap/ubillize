"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { staff } from "@/db/schema"
import { AddStaffDialog } from "./add-staff"
import { StaffEditAndDeleteActions } from "./edit-staff"

export interface StaffUsersTableProps {
    data: {
        staff: typeof staff.$inferSelect,
        users: {
            role: string
        } | null
    }[]
}

const firstCharCapital = (s: string) => {
    const t = s.split('')
    t[0] = t[0].toUpperCase()
    return t.join('')
}

export function StaffUsersTable({ data }: StaffUsersTableProps){
    const adminCount = data.filter(ea => ea.users?.role === 'admin').length
    return (
        <Card className="relative">
            <CardHeader>
                <AddStaffDialog />
                <CardTitle className="text-lg">Staff Accounts</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((s, i) => (
                            <TableRow key={i}>
                                <TableCell>{s.staff.displayName}</TableCell>
                                <TableCell>{firstCharCapital(s.users?.role || 'null')}</TableCell>
                                <TableCell>{s.staff.email}</TableCell>
                                <TableCell className="flex justify-end"><StaffEditAndDeleteActions data={s} deleteDisabled={((s.users?.role === 'admin') && (adminCount < 2))}  /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}