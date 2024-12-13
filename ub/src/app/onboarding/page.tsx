"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { onboardTenant } from "./actions"
import { LoadingSpiner } from "@/components/svg/loading-spiner"

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name must be at least 1 characters.",
    }),
    surname: z.string().min(1, {
        message: "Surname must be at least 1 characters.",
    }),
    email: z.string().email("Please enter a valid email address"),
    roomNo: z.string()
})

export default function Onboarding(){
    const [status, setStatus] = useState<'ready'|'loading'|'success'|'failed'>('ready')
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            surname: "",
            email: "",
            roomNo: ""
        }
    })
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setStatus('loading')
        const bodyData = {
            ...values,
            id: id as string
        }
        const res = await onboardTenant(bodyData)
        if (res.status === 200){
            setStatus('success')
        }
        else {
            setStatus('failed')
        }
    }
    return (
        <>
            <div className="flex flex-col gap-y-2">
                <h1 className="text-3xl text-center text-black prompt-bold">Registration</h1>
                {(status === 'ready') && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field } ) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Somsak" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="surname"
                                render={({ field } ) => (
                                    <FormItem>
                                        <FormLabel>Surname</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Saksom" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="somsak@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="roomNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Room Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="501" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Your room number (please check with the staff first).
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">Submit</Button>
                        </form>
                    </Form>
                )}
                {(status === 'loading') && (
                    <div className="flex flex-col gap-y-2">
                        <LoadingSpiner className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="text-lg text-center">Loading..</p>
                    </div>
                )}
                {(status === 'success') && (
                    <div className="flex flex-col gap-y-2">
                        <meta http-equiv="refresh" content="0; url=/tenant" />
                        <CheckCircleIcon className="w-16 h-16 mx-auto" />
                        <p className="text-lg text-center">Success!</p>
                        <p className="text-lg text-center">Redirecting you to main application.</p>
                    </div>
                )}
                {(status === 'failed') && (
                    <div className="flex flex-col gap-y-2">
                        <ExclamationTriangleIcon className="w-16 h-16 mx-auto" />
                        <p className="text-lg text-center">Error!</p>
                        <p className="text-lg text-center">Please try again.</p>
                        <p className="text-lg text-center">If error persist, contact administrator.</p>
                    </div>
                )}
            </div>
        </>
    )
}