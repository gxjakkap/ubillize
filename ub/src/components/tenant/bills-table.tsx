"use client"

import { shortDateString, formatDateString } from "@ubillize/date"
import { bills } from "@ubillize/db/schema"
import { redirect, RedirectType } from "next/navigation"

import { Badge } from "../ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

type BD = typeof bills.$inferSelect

export interface BillsTableProps{
    billsData: BD[]
}

export function BillsTable({ billsData }: BillsTableProps){
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Total Due</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {billsData.map((b) => (
                    <TableRow key={b.id} onClick={() => redirect(`/tenant/bill/${b.id}`, RedirectType.push)} className="cursor-pointer">
                        <TableCell>{shortDateString(b.dateAdded.valueOf())}</TableCell>
                        <TableCell>{formatDateString(b.dateDue.valueOf())}</TableCell>
                        <TableCell className="text-right">฿{b.totalDueAmount.toFixed(2)}</TableCell>
                        <TableCell>
                            <Badge variant={b.paid ? "secondary" : "destructive"}>
                                {b.paid ? "Paid" : "Unpaid"}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export function BillsTableLoading() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Total Due</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
