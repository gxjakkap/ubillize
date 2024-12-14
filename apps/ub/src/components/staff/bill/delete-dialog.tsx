"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cancelBill } from "@/app/staff/bill/[id]/actions"
import { useState } from "react"
import { redirect } from "next/navigation"

export function BillDeleteDialog({ id, roomNo }: { id: number, roomNo: string }){
    const [status, setStatus] = useState<'ready' | 'loading' | 'success' | 'failed'>('ready')
    const [open, setOpen] = useState(false)
    const onConfirm = async() => {
        setStatus('loading')
        const res = await cancelBill(id, roomNo)
        if (res.status === 200) {
            setStatus('success')
            setOpen(false)
            redirect('/staff')
        }
        else {
            setStatus('failed')
        }
    }
    return (
        <>
            <Button variant="destructive" onClick={() => setOpen(true)}>🗑️ Cancel</Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete bill #{id.toString()}? 
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="destructive" 
                            onClick={onConfirm}
                            disabled={(status === 'loading')}
                        >
                            {(status === 'loading') ? "Deleting..." : "Delete"}
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}