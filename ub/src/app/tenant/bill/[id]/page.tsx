import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@ubillize/db"
import { tenant, bills } from "@ubillize/db/schema"
import { and, eq } from "@ubillize/db/orm"
import { XMarkIcon } from "@heroicons/react/24/outline"


import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDateString, shortDateString } from "@ubillize/date"


interface BillPageProps {
    params: Promise<{ id: string }>
}

export default async function BillPage({ params }: BillPageProps){
    const billId = (await params).id
    const session = await auth()
    if (!session){
        return
    }
    const [userData] = await db.select({ roomNo: tenant.roomNo, id: tenant.id, name: tenant.name, surname: tenant.surname }).from(tenant).where(eq(tenant.id, session.user.id)).limit(1)
    const [billData] = await db.select().from(bills).where(and(eq(bills.id, parseInt(billId)), eq(bills.roomNo, userData.roomNo!))).limit(1)
    if (!billData){
        return notFound()
    }
    return (
        <div className="container mx-auto px-4 py-8 max-w-md">
            <Card className="relative">
                <CardHeader>
                    <Link href="/tenant" className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800">
                        <XMarkIcon className="w-8 h-8" />
                    </Link>
                    <CardTitle className="text-center text-xl">Bill for {shortDateString(billData.dateAdded.valueOf())}</CardTitle>
                    <p className="text-center text-muted-foreground">Room {billData.roomNo}</p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="text-center">
                            <p className="text-lg font-medium">Total Amount Due</p>
                            <p className="text-3xl font-bold">฿{billData.totalDueAmount.toFixed(2)}</p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <BillItem label="Rent" amount={billData.rentDueAmount} />
                            {(typeof billData.electDueAmount === 'number' && billData.electDueAmount > 0) && <BillItem label="Electricity" amount={billData.electDueAmount} unit={billData.electUnit} />}
                            {(typeof billData.waterDueAmount  === 'number' && billData.waterDueAmount > 0) && <BillItem label="Water" amount={billData.waterDueAmount} unit={billData.waterUnit} />}
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Due Date: {formatDateString(billData.dateDue.valueOf())}</p>
                            <p className="text-sm font-medium">Status: <span className={billData.paid ? "text-green-600" : "text-red-600"}>{billData.paid ? "Paid" : "Unpaid"}</span></p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="sm:justify-start">
                    <Link href={`/tenant/bill/${billData.id}/pay`} className="w-full">
                        <Button className="w-full" disabled={billData.paid}>
                            {billData.paid ? "Paid" : "Pay Now"}
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

interface BillItemProps {
    label: string
    amount: number
    unit?: number | null
}

function BillItem({ label, amount, unit }: BillItemProps) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-sm">{label}{unit ? ` (${unit} units)` : ''}</span>
            <span className="text-sm font-medium">฿{amount.toFixed(2)}</span>
        </div>
    )
}