import { db } from "@ubillize/db"
import { eq } from "@ubillize/db/orm"
import { bills, staff } from "@ubillize/db/schema"
import { notFound } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDateString } from "@ubillize/date"
import { CURRENCY_SYMBOL } from "@/lib/const"
import { OSVDataDialog } from "@/components/staff/bill/osv-data-viewer"
import { SlipDialog } from "@/components/staff/bill/slip-image-dialog"
import { BillArchiveDialog } from "@/components/staff/bill/archive-dialog"
import { BillDeleteDialog } from "@/components/staff/bill/delete-dialog"

interface StaffBillPageProps {
    params: Promise<{ id: string }>
}

export default async function StaffBillPage({ params }: StaffBillPageProps) {
    const { id } = await params

    const [billData] = await db
        .select({ id: bills.id, dateAdded: bills.dateAdded, dateDue: bills.dateDue, electUnit: bills.electUnit, waterUnit: bills.waterUnit, electDueAmount: bills.electDueAmount, waterDueAmount: bills.waterDueAmount, rentDueAmount: bills.rentDueAmount, totalDueAmount: bills.totalDueAmount, paid: bills.paid, paidDate: bills.paidDate, payer: bills.payer, slip: bills.slip, addedBy: bills.addedBy, addedByName: staff.displayName, addedByMail: staff.email, archiveStatus: bills.archiveStatus, archiveDate: bills.archiveDate, osvData: bills.osvData, roomNo: bills.roomNo })
        .from(bills)
        .where(eq(bills.id, parseInt(id)))
        .leftJoin(staff, eq(bills.addedBy, staff.id))
        .limit(1)

    if (!billData){
        notFound()
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="text-4xl text-center">Bill #{billData.id}</CardTitle>
                    <Badge className="w-min mx-auto text-lg" variant={billData.archiveStatus ? 'secondary' : (billData.paid ? "success" : "destructive")}>
                        {billData.archiveStatus ? "Archived" : (billData.paid ? "Paid" : "Unpaid")}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="w-full flex justify-center gap-x-10 xl:gap-x-32">
                        <div className="flex flex-col gap-y-4 text-left">
                            <div className="flex flex-col">
                                <p className="text-base"><span className="font-medium">Date Added:</span> {formatDateString(billData.dateAdded.valueOf())} by {billData.addedByName} ({billData.addedByMail})</p>
                                <p className="text-base"><span className="font-medium">Due Date:</span> {formatDateString(billData.dateDue.valueOf())}</p>
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-bold mb-2">Renter Info</h2>
                                <p className="text-base"><span className="font-medium">Room Number:</span> {billData.roomNo}</p>
                            </div>
                            {(billData.archiveStatus) && (<div className="flex flex-col">
                                <h2 className="text-xl font-bold mb-2">Archive Info</h2>
                                <p className="text-base"><span className="font-medium">Archive status:</span> Archived</p>
                                <p className="text-base"><span className="font-medium">Archive on:</span> {formatDateString(billData.archiveDate?.valueOf() || 1)}</p>
                            </div>)}
                            <div className="flex flex-col">
                                <h2 className="text-xl font-bold mb-2">Due Amount</h2>
                                {(billData.waterDueAmount !== null) && (<p className="text-base"><span className="font-medium">Water 🚿:</span> {CURRENCY_SYMBOL} {billData.waterDueAmount.toFixed(2)}</p>)}
                                {(billData.electDueAmount !== null) && (<p className="text-base"><span className="font-medium">Electricity ⚡:</span> {CURRENCY_SYMBOL} {billData.electDueAmount.toFixed(2)}</p>)}
                                <p className="text-base"><span className="font-medium">Rent & etc 🛏️:</span> {CURRENCY_SYMBOL} {billData.rentDueAmount.toFixed(2)}</p>
                                <p className="text-base font-medium"><span className="font-medium">Total Due Amount:</span> {CURRENCY_SYMBOL} {billData.totalDueAmount.toFixed(2)}</p>
                            </div>
                            {(billData.paid) && (<div className="flex flex-col">
                                <h2 className="text-xl font-bold mb-2">Payment Info</h2>
                                {(billData.paidDate !== null) && (<p className="text-base"><span className="font-medium">Paid on:</span> {formatDateString(billData.paidDate.valueOf())}</p>)}
                                {(billData.payer !== null) && (<p className="text-base"><span className="font-medium">Paid by:</span> {billData.payer}</p>)}
                                {(billData.osvData !== null) && (<p className="text-base"><span className="font-medium">View OSV Data:</span> <OSVDataDialog data={JSON.stringify(billData.osvData)} /></p>)}
                                {(billData.slip !== null) && (<p className="text-base"><span className="font-medium">View Payment Slip:</span> <SlipDialog imgKey={billData.slip} /></p>)}
                                
                            </div>)}
                        </div>
                        <div className="flex flex-col gap-y-4 pr-10">
                            <div className="flex flex-col gap-y-3">
                                <p className="font-bold text-lg">Action:</p>
                                {/* {(!billData.paid) && (<Button variant="secondary">✏️ Edit</Button>)} */}
                                {(billData.paid) && (<BillArchiveDialog id={billData.id} archiveStatus={billData.archiveStatus} />)}
                                {(!billData.paid) && (<BillDeleteDialog id={billData.id} roomNo={billData.roomNo} />)}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}