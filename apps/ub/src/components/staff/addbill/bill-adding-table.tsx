"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { shortDateString } from "@ubillize/date"

import { cn } from "@/lib/utils"
import { CURRENCY_SYMBOL } from "@/lib/const"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { addBills } from "@/app/staff/addbill/actions"
import { redirect } from "next/navigation"

interface BillDataEach {
    room: string;
    electricity: string;
    water: string;
    rent: string;
    dueDate: Date | null;
}


export function AddBillTable({ rooms }: { rooms: string[] }){
    const { toast } = useToast()
    const [billData, setBillData] = useState<BillDataEach[]>(
        rooms.map((room) => ({
          room,
          electricity: '',
          water: '',
          rent: '',
          dueDate: null
    })))
    const [dueDate, setDueDate] = useState<Date>()
    const [status, setStatus] = useState<'ready'|'loading'|'success'|'failed'>('ready')

    const handleInputChange = (room: string, field: string, value: string | Date) => {
        setBillData((prev) =>
          prev.map((bill) =>
            bill.room === room ? { ...bill, [field]: value } : bill
          )
        )
    }

    const handleDueDateChange = (newSelected: Date | undefined) => {
        if (!newSelected) return
        setDueDate(newSelected)
        rooms.forEach(r => {
            handleInputChange(r, 'dueDate', newSelected)
        })
    }

    const handleSubmit = async() => {
        setStatus('loading')
        if (!dueDate || typeof dueDate === null){
            setStatus('failed')
            toast({
                title: 'Error!',
                description: 'Please specify bills due date!',
                variant: 'destructive'
            })
            return
        }

        const filteredData = billData
        .filter((bill) => {
            const { electricity, water, rent } = bill
            return electricity || water || rent
        })
        .map((bill) => ({
            ...bill,
            electricity: bill.electricity || "0",
            water: bill.water || "0",
            rent: bill.rent || "0",
        }))

        if (filteredData.length === 0){
            setStatus('failed')
            toast({
                title: 'Error!',
                description: 'Please fill out data before submitting!',
                variant: 'destructive'
            })
            return
        }
        
        toast({
            title: 'Submitting...',
            description: 'Sending data to server.'
        })
        
        const res = await addBills(filteredData as never)

        if (res.status === 201){
            setStatus('success')
            toast({
                title: 'Success',
                description: 'Bills added.',
                variant: 'success'
            })
            redirect('/staff')
        }
        else {
            setStatus('failed')
            toast({
                title: 'Error!',
                description: `Server Error`,
                variant: 'destructive'
            })
        }
    }
    return (
        <>
            <Card>
                <CardHeader className="flex flex-col gap-y-3">
                    <CardTitle className="text-2xl text-center">
                        Add bills for {shortDateString(Date.now())}
                    </CardTitle>
                    <div className="flex gap-x-2">
                        <span className="font-medium">Set due date: </span>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !dueDate && "text-muted-foreground"
                                    )}
                                >
                                <CalendarIcon />
                                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dueDate}
                                    onSelect={handleDueDateChange}
                                    initialFocus
                                    required
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-y-4 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Room</TableHead>
                                    <TableHead>⚡ Electricity ({CURRENCY_SYMBOL})</TableHead>
                                    <TableHead>🚿 Water ({CURRENCY_SYMBOL})</TableHead>
                                    <TableHead>🛏️ Rent & etc ({CURRENCY_SYMBOL})</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {rooms.map((r) => (
                                <TableRow key={r}>
                                    <TableCell>{r}</TableCell>
                                    <TableCell>
                                        <Input
                                            value={
                                                billData.find((bill) => bill.room === r)?.electricity || ''
                                            }
                                            onChange={(e) =>
                                                handleInputChange(r, "electricity", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={
                                                billData.find((bill) => bill.room === r)?.water || ''
                                            }
                                            onChange={(e) =>
                                                handleInputChange(r, "water", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={
                                                billData.find((bill) => bill.room === r)?.rent || ''
                                            }
                                            onChange={(e) =>
                                                handleInputChange(r, "rent", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        <Button variant="default" onClick={handleSubmit} className="w-full" disabled={(status==='loading'||status==='success')}>Submit</Button>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}