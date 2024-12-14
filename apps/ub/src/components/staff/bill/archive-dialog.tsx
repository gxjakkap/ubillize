"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { archiveBill } from "@/app/staff/bill/[id]/actions"
import { useState } from "react"

export function BillArchiveDialog({ id, archiveStatus }: { id: number, archiveStatus: boolean }){
    const [status, setStatus] = useState<'ready' | 'loading' | 'success' | 'failed'>('ready')
    const [open, setOpen] = useState(false)
    const onConfirm = async() => {
        setStatus('loading')
        const res = await archiveBill(id, archiveStatus)
        if (res.status === 200) {
            setStatus('success')
            setOpen(false)
            window.location.reload()
        }
        else {
            setStatus('failed')
        }
    }
    return (
        <>
            <Button variant="secondary" onClick={() => setOpen(true)}>💾 {archiveStatus ? 'Unarchive' : 'Archive'}</Button>
            <Dialog open={open} onOpenChange={() => setOpen(false)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm {archiveStatus ? 'Unarchiving' : 'Archiving'}</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to {archiveStatus ? 'unarchive' : 'archive'} Bill #{id.toString().padStart(5, '0')}? 
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="button" 
                            variant="secondary" 
                            onClick={onConfirm}
                            disabled={(status === 'loading' || status === 'success')}
                        >
                            {(status === 'loading') ? (archiveStatus ? 'Unarchiving...' : 'Archiving...') : (archiveStatus ? 'Unarchive' : 'Archive')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}