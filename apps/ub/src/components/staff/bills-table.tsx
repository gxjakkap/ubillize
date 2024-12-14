'use client'

import { shortDateString, formatDateString } from "@ubillize/date"
import { Badge } from "../ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table"
import { bills } from "@ubillize/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { Button } from "@/components/ui/button"
import { InferSelectModel } from "@ubillize/db/orm"

//type BD = typeof bills.$inferSelect

type BD = InferSelectModel<typeof bills> & { addedByName: string | null, addedByMail: string | null }

export interface BillsTableProps{
    billsData: BD[]
}

export const StaffBillsTable = ({ billsData }: BillsTableProps) =>{
    return (
        <Card className="relative">
            <CardHeader>
                <Button 
                    className="absolute top-5 right-5 p-2"
                    onClick={() => redirect('/staff/addbill')}
                >
                    Add Bills
                </Button>
                <CardTitle className="text-lg">Bills</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Month</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Added By</TableHead>
                                <TableHead className="text-right">Total Due</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {billsData.map((b) => (
                            <TableRow key={b.id} onClick={() => redirect(`/staff/bill/${b.id}`, RedirectType.push)} className="cursor-pointer">
                                <TableCell>{shortDateString(b.dateAdded.valueOf())}</TableCell>
                                <TableCell>{formatDateString(b.dateDue.valueOf())}</TableCell>
                                <TableCell>{b.roomNo}</TableCell>
                                <TableCell>{b.addedByName}</TableCell>
                                <TableCell className="text-right">฿{b.totalDueAmount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant={b.archiveStatus ? 'secondary' : (b.paid ? "success" : "destructive")}>
                                    {b.archiveStatus ? "Archived" : (b.paid ? "Paid" : "Unpaid")}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}