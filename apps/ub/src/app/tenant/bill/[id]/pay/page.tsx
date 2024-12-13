import { db } from "@ubillize/db"
import { bills, settings, tenant } from "@ubillize/db/schema"
import { eq, and, or } from "@ubillize/db/orm"
import { notFound } from "next/navigation"

import { auth } from "@/auth"
import { PayBill, PayBillProps } from "@/components/tenant/bill/pay"
import { FullBankData } from "@/lib/const"

interface PayBillPageProps {
    params: Promise<{ id: string }>
}

export default async function PayBillPage({ params }: PayBillPageProps){
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

    const bankSettings = await db.select().from(settings).where(or(eq(settings.key, 'receivingBankAccNum'), eq(settings.key, 'receivingBankId')))
    const bankId = bankSettings.filter(y => y.key === 'receivingBankId')[0].val

    const bankDataFromConst = FullBankData.filter(x => x.code === bankId)[0]

    const bankData: PayBillProps['bankData'] = {
        bankName: bankDataFromConst.nice_name,
        bankNum: bankSettings.filter(x => x.key === 'receivingBankAccNum')[0].val || '0',
        bankColor: bankDataFromConst.color,
        bankShortName: bankDataFromConst.short
    }

    return (
        <PayBill billData={billData} tenantId={userData.id} bankData={bankData} />
    )
}