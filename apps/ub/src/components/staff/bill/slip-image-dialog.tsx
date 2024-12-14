"use client"

import { getSlipPresignedURL } from "@/app/staff/bill/[id]/actions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

export function SlipDialog({ imgKey }: { imgKey: string }){
    const [imageUrl, setImageUrl] = useState<string|null>(null)
    const [dialogOpen, setDialogopen] = useState(false)

    const handleViewImage = async() => {
        if (!imageUrl){
            console.log(imgKey)
            const presignedUrl = await getSlipPresignedURL(imgKey)
            setImageUrl(presignedUrl)
        }
        setDialogopen(true)
    }
    return (
        <>
            <Button variant="ghost" onClick={handleViewImage}>View slip image</Button>
            <Dialog open={dialogOpen} onOpenChange={() => setDialogopen(false)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Slip</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center p-6">
                        {imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                                src={imageUrl} 
                                alt={`slip`}
                                className="max-w-full max-h-[60vh] object-contain rounded-lg"
                            />
                        ) : (
                            <div className="text-gray-500">No image available</div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}