/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"

import { updateSettings } from "@/app/staff/settings/actions"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { BankOptions } from "@/lib/const"

export interface Settings {
  id: number
  key: string
  val: string | null
}

export interface SettingsKeyValEditorProps {
  settingsData: Settings[]
}

export function SettingsKeyValEditor({ settingsData }: SettingsKeyValEditorProps) {
    const { toast } = useToast()
    const [settingsValue, setSettingsValue] = useState(settingsData)
    const [editMode, setEditMode] = useState<{ [key: number]: boolean }>(
        Object.fromEntries(settingsData.map((s) => [s.id, false]))
    )

    console.log(settingsValue)

    const handleInputChange = (id: number, newValue: string) => {
        setSettingsValue((prev) =>
            prev.map((s) => (s.id === id ? { ...s, val: newValue } : s))
        )
    }

    const toggleEditMode = async (id: number, cancel?: boolean) => {
        const curSetting = settingsValue.filter((s) => s.id === id)[0]
        if (editMode[id]){
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const res = await updateSettings({ key: curSetting.key , nVal: (curSetting.val?.length && curSetting.val?.length > 0) ? curSetting.val : null })
            if (!cancel){
                toast({
                    title: `${curSetting.key} edited successfully!`,
                    description: 'Your changes has been saved.',
                    variant: 'success',
                })
            }
        }
        setEditMode((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    const ReceivingBankAccNumSetting = () => {
        const [ss] = settingsValue.filter((x) => x.key === "receivingBankAccNum")
        const [localValue, setLocalValue] = useState(ss?.val || "")
    
        if (!ss) return <></>
    
        const handleSave = () => {
            handleInputChange(ss.id, localValue)
            toggleEditMode(ss.id)
        }
    
        return (
            <div className="flex items-center gap-x-2 mb-2 w-3/4" key={ss.id}>
                <p className="font-medium">Receiving Bank Account No.</p>
                <div className="flex items-center gap-x-2 ml-auto">
                    <Input
                        type="text"
                        value={localValue}
                        disabled={!editMode[ss.id]}
                        onChange={(e) => {
                            setLocalValue(e.target.value)
                            console.log(localValue)
                        }}
                        className="w-96"
                    />
                    <Button
                        variant="default"
                        onClick={() => (editMode[ss.id] ? handleSave() : toggleEditMode(ss.id))}
                    >
                        {editMode[ss.id] ? "Save" : "Edit"}
                    </Button>
                    {(editMode[ss.id]) && (
                        <Button
                            variant="destructive"
                            onClick={() => toggleEditMode(ss.id, true)}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    const ReceivingBankId = () => {
        const [ss] = settingsValue.filter(x => x.key === 'receivingBankId')
        if (!ss) return (<></>)
        return (
            <div className="flex items-center gap-x-2 mb-2 w-3/4" key={ss.id}>
                    <p className="font-medium">Receiving Bank</p>
                    <div className="flex items-center justify-end gap-x-2 ml-auto">
                        <Select 
                            value={ss.val || undefined}
                            disabled={!editMode[ss.id]}
                            onValueChange={(val) => handleInputChange(ss.id, val)}
                        >
                            <SelectTrigger className="w-96">
                                <SelectValue placeholder="Select you bank here" />
                            </SelectTrigger>
                            <SelectContent className="w-96 bg-white max-h-48" defaultValue={ss.val || undefined}>
                                {BankOptions.map((b) => (
                                    <SelectItem value={b.code} key={b.code}>{b.nice_name} ({b.short.toUpperCase()})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="default"
                            onClick={() => toggleEditMode(ss.id)}
                        >
                            {editMode[ss.id] ? "Save" : "Edit"}
                        </Button>
                        {(editMode[ss.id]) && (
                            <Button
                                variant="destructive"
                                onClick={() => toggleEditMode(ss.id, true)}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent>
                {/* {settingsValue.map((s) => (
                    <div className="flex items-center gap-x-2 mb-2 w-1/2" key={s.id}>
                            <p className="font-medium">{s.key}</p>
                            <div className="flex items-center gap-x-2 ml-auto">
                                <Input
                                    type="text"
                                    value={s.val || ""}
                                    disabled={!editMode[s.id]}
                                    onChange={(e) => handleInputChange(s.id, e.target.value)}
                                    className="w-96"
                                />
                                <Button
                                    variant="default"
                                    onClick={() => toggleEditMode(s.id)}
                                >
                                    {editMode[s.id] ? "Save" : "Edit"}
                                </Button>
                            </div>
                    </div>
                ))} */}
                <ReceivingBankAccNumSetting />
                <ReceivingBankId />
                
            </CardContent>
        </Card>
    )
}
