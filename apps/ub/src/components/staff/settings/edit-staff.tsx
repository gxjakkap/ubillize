import { staff } from "@ubillize/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, CheckCircleIcon, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { deleteStaffAccount, editStaffAccount } from "@/app/staff/settings/actions"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { LoadingSpiner } from "@/components/svg/loading-spiner"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Data {
    staff: typeof staff.$inferSelect,
    users: {
        role: string
    } | null
}

const ROLES = ["staff", "admin"] as const
const RoleEnum = z.enum(ROLES)

const passwordSchema = z
  .string()
  .optional()
  .refine((password) => password === undefined || password.length === 0 || password.length >= 11, {
    message: "Password must be longer than 10 characters",
  })
  .refine((password) => password === undefined || password.length === 0 || /[A-Z]/.test(password), {
    message: "Password must contain at least 1 uppercase letter",
  })
  .refine((password) => password === undefined || password.length === 0 || /[a-z]/.test(password), {
    message: "Password must contain at least 1 lowercase letter",
  })
  .refine((password) => password === undefined || password.length === 0 || /[0-9]/.test(password), {
    message: "Password must contain at least 1 number",
  })
  .refine((password) => password === undefined || password.length === 0 || /[!@#$%^&*]/.test(password), {
    message: "Password must contain at least 1 special character",
  })

const editFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email("Must be a valid email address."),
    password: passwordSchema,
    role: RoleEnum
})

function EditDialog({ data, isOpen, onClose }: { data: Data, isOpen: boolean, onClose: () => void }){
    const [status, setStatus] = useState<'ready' | 'loading' | 'success' | 'failed'>('ready')
    const [errMsg, setErrMsg] = useState('')
    const form = useForm<z.infer<typeof editFormSchema>>({
        resolver: zodResolver(editFormSchema),
        defaultValues: {
            name: data.staff.displayName,
            email: data.staff.email,
            role: data.users?.role as never,
            password: ''
        },
    })
    const onSubmit = async(formData: z.infer<typeof editFormSchema>) => {
        setStatus('loading')
        const d: Partial<z.infer<typeof editFormSchema>> = {}
        
        if (formData.name !== data.staff.displayName){
            d.name = formData.name
        }

        if (formData.email !== data.staff.email){
            d.email = formData.email
        }

        if (formData.password){
            d.password = formData.password
        }

        if (formData.role !== data.users?.role){
            d.role = formData.role
        }

        const res = await editStaffAccount(d, data.staff.id)
        if (res.status === 200) {
            setStatus('success')
            window.location.reload()
        }
        else {
            setStatus('failed')
            setErrMsg(res.err || 'unknown error')
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit staff account</DialogTitle>
                    <DialogDescription>
                        {data.staff.displayName} - {data.users?.role}
                    </DialogDescription>
                </DialogHeader>
                    {(status === 'ready' || status === 'failed') && (<Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Somsak Saksom" {...field} />
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
                                                <Input placeholder="rejoice@ubillize.app" {...field} />
                                            </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="************" type="password" {...field} />
                                            </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="staff">Staff</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>)}
                    {(status === 'failed') && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {errMsg}
                            </AlertDescription>
                        </Alert>
                    )}
                    {(status === 'loading') && (
                        <div className="flex flex-col w-full h-full items-center justify-center">
                            <LoadingSpiner className="w-16 h-16 mx-auto" />
                            <p className="text-center text-lg">Saving changes</p>
                        </div>
                    )}
                    {(status === 'success') && (
                        <div className="flex flex-col w-full h-full items-center justify-center">
                            <CheckCircleIcon className="w-16 h-16 mx-auto" />
                            <p className="text-center text-lg">Saved!</p>
                        </div>
                    )}
                <DialogFooter>
                    {(status === 'ready' || status === 'failed') && (
                        <>
                            <DialogClose asChild>
                                <Button variant="destructive">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Save</Button>
                        </>
                    )}
                    {(status === 'success') && (
                        <DialogClose asChild>
                            <Button className="mx-auto">Close</Button>
                        </DialogClose>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DeleteDialog({ data, isOpen, onClose }: { data: Data, isOpen: boolean, onClose: () => void }){
    const [status, setStatus] = useState<'ready' | 'loading'>('ready')
    const onConfirm = async () => {
        setStatus('loading')
        await deleteStaffAccount(data.staff.id)
        onClose()
        window.location.reload()
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete {data.staff.displayName}&apos;s account? 
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
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function StaffEditAndDeleteActions({ data, deleteDisabled }: { data: Data, deleteDisabled: boolean }){
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)


    return (
        <div className="flex gap-2">
            <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setEditOpen(true)}
                className="h-8 w-8 p-0"
            >
                <Pencil className="h-4 w-4" />
            </Button>
            {(!deleteDisabled) && (<Button 
                variant="ghost" 
                size="icon"
                onClick={() => setDeleteOpen(true)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
                <Trash2 className="h-4 w-4" />
            </Button>)}
            {(deleteDisabled) && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                disabled={deleteDisabled}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white">
                            <p>Cannot delete the only admin account</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}

            <EditDialog
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                data={data}
            />

            <DeleteDialog
                data={data}
                isOpen={deleteOpen}
                onClose={() => setDeleteOpen(false)}
            />
        </div>
    )
}