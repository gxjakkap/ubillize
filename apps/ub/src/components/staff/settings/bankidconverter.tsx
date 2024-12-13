"use client"

import { Button } from "@/components/ui/button"
import { DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { BankDict } from "@/lib/const"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardIcon } from "@heroicons/react/24/outline"
import { useToast } from "@/components/ui/use-toast"

export function BankIdConverter(){
    const { toast } = useToast()
    const bankEntries = Object.entries(BankDict)
    const [bank, setBank] = useState(bankEntries[0])

    const handleBankChange = (value: string) => {
        setBank(
            bankEntries.filter(b => b[0] === value)[0]
        )
    }

    const copyCodeToClipboard = () => {
        navigator.clipboard.writeText(bank[0])
        toast({
            title: 'Copied!',
            description: `'${bank[0]}' copied to clipboard!`,
            variant: 'default'
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">BankIdConverter</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Bank Id Converter</DialogTitle>
                    <DialogDescription>
                        Get Bank Id for your Thai Bank
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Your bank name
                        </Label>
                        <Select value={bank[0]} onValueChange={handleBankChange}>
                            <SelectTrigger className="w-[250px]">
                                <SelectValue placeholder="Select a bank" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px] bg-white">
                                {bankEntries.map(b => (
                                    <SelectItem value={b[0]} key={b[0]}>{b[1]}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <p className="text-lg text-center">Bank Id: {bank[0]}</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={copyCodeToClipboard}><ClipboardIcon className="w-6" />Copy & Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}