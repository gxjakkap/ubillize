"use client"

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckIcon, ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { Clipboard } from 'lucide-react'
import { z } from "zod"

import { slipUploadAction } from "@/app/tenant/bill/[id]/pay/actions"
import { SlipUpload } from "@/components/tenant/bill/uploadform"
import { bills } from "@ubillize/db/schema"
import { SLIP_MAX_FILE_SIZE } from "@/lib/const"
import { shortDateString } from "@ubillize/date"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { LoadingSpiner } from "@/components/svg/loading-spiner"
import BankLogo from '@/components/bank-logo'
import { useToast } from '@/components/ui/use-toast'



export interface PayBillProps {
    billData: typeof bills.$inferSelect,
    tenantId: string,
    bankData: {
        bankName: string,
        bankNum: string,
        bankColor: string,
        bankShortName: string
    }
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

const slipUploadFormSchema = z.object({
    img: z.object({
        file: z
            .instanceof(File)
            .refine((file) => file.size <= SLIP_MAX_FILE_SIZE, `Max image size is 10MB.`)
            .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
                "Only .jpg, .png, and .webp formats are supported."
            ),
    })
})

export function PayBill({ billData, tenantId, bankData }: PayBillProps){
    console.log(bankData)
    const [status, setStatus] = useState<'ready'|'loading'|'success'|'failed'>('ready')
    const [errorMessage, setErrorMessage] = useState("")
    const [file, setFile] = useState<{ file: File; preview: string } | null>(null)

    const slipUploadForm = useForm<z.infer<typeof slipUploadFormSchema>>({
        resolver: zodResolver(slipUploadFormSchema),
    })

    const router = useRouter()
    const { toast } = useToast()

    const onSubmit = async(values: z.infer<typeof slipUploadFormSchema>) => {
        console.log(values)
        setStatus('loading')
        const res = await slipUploadAction(values.img.file, billData.id, tenantId)
        if (res.status === 201){
            setStatus('success')
            setTimeout(() => {
                router.push('/tenant')
            }, 5000)
        }
        else {
            setStatus('failed')
            if (res.err === 0){
                setErrorMessage("Invalid slip or amount! Check again or contact staff.")
            }
            else if (res.err === 1){
                setErrorMessage("Rate limited. Please try again later. If problem presist, contact staff.")
            }
            else if (res.err === 2){
                setErrorMessage("There's an error uploading your slip to our service. ")
            }
            else {
                setErrorMessage("Unknown Error. Try again or contact staff.")
            }
        }
    }
    return (
        <div className="container mx-auto px-4 py-8 max-w-md">
            <Card className="relative">
                <CardHeader>
                    <Link href={`/tenant/bill/${billData.id}`} className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800">
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
                        <div className={`flex mx-4 gap-x-3 px-1 py-2 rounded-sm items-center`} style={{ backgroundColor: bankData.bankColor }}>
                            <BankLogo bankCode={bankData.bankShortName} />
                            <div className="flex flex-col">
                                <p className={`text-white`}>{bankData.bankName}</p>
                                <p className={`text-white`}>{bankData.bankNum}</p>
                            </div>

                            
                            
                            <Clipboard 
                                className="text-white h-8 w-12 ml-auto mr-5 hover:bg-white/10 rounded-sm"
                                onClick={() => {
                                    navigator.clipboard.writeText(bankData.bankNum)
                                    toast({
                                        title: 'Copied!',
                                        description: 'Account number copied to clipboard.'
                                    })
                                }} 
                            />
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Form {...slipUploadForm}>
                                <form onSubmit={slipUploadForm.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={slipUploadForm.control}
                                        name="img"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Slip Image</FormLabel>
                                                <FormControl>
                                                    <SlipUpload
                                                        file={file}
                                                        setFile={(newFile: { file: File; preview: string } | null) => {
                                                            setFile(newFile)
                                                            field.onChange(newFile ? { file: newFile.file } : null)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Upload slip image.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={(status === 'success')}>
                                        Submit
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Dialog open={(status === 'success')}>
                <DialogContent className="sm:max-w-[425px]">
                    <div className="flex flex-col w-full mx-auto justify-center">
                        <CheckIcon className="text-green-500 w-24 h-24 mx-auto" />
                        <p className="text-center text-xl font-medium">Success!</p>
                        <p className="text-center text-lg">Redirecting you back to main page...</p>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={(status === 'loading')}>
                <DialogContent className="sm:max-w-[425px]">
                    <div className="flex flex-col w-full mx-auto justify-center">
                        <LoadingSpiner className="mx-auto h-16 w-16 text-gray-400" />
                        <p className="text-center text-xl font-medium">Processing</p>
                        <p className="text-center text-lg">We are processing your payment...</p>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={(status === 'failed')}>
                <DialogContent className="sm:max-w-[425px]">
                    <div className="flex flex-col w-full mx-auto justify-center">
                        <ExclamationCircleIcon className="text-red-500 w-24 h-24 mx-auto" />
                        <p className="text-center text-xl font-medium">Failed!</p>
                        <p className="text-center text-lg">{errorMessage}</p>
                    </div>
                    <Button className="mx-auto" type="button" variant="secondary" onClick={() => router.push('/tenant')}>
                        Go back
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}