"use client"

import SyntaxHighlighter from 'react-syntax-highlighter'
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"


export function OSVDataDialog({ data }: { data: string}){
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost">View OpenSlipVerify Data</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>OSVData</DialogTitle>
                    <DialogDescription>
                        Raw data from OpenSlipVerify
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 max-w-sm">
                    <SyntaxHighlighter style={vs2015} wrapLongLines>
                        {data}
                    </SyntaxHighlighter>
                </div>
            </DialogContent>
        </Dialog>
    )
}