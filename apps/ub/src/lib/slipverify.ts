import axios, { type AxiosRequestConfig } from "axios"

export interface SlipVerifyData {
    receivingBank: string
    sendingBank: string
    transDate: string
    transTime: string
    sender: {
        displayName: string
        name: string
        account: {
            value: string
        }
    }
    receiver: {
        displayName: string
        name: string
        account: {
            value: string
        }
    }
    amount: number
}

export enum SlipVerifyError {
    InvalidSlipOrQr = 0,
    OpenSlipVerifyError = 1,
    RateLimitError = 2,
    AMLError = 3,
    UnknownError = 4
}

export interface SlipVerifyRes {
    success: boolean,
    err?: SlipVerifyError,
    data?: SlipVerifyData
}

export const slipVerify = async(refNbr: string, amount: number): Promise<SlipVerifyRes> => {
    const token = process.env.OSV_TOKEN!
    const reqBody = {
        refNbr,
        amount,
        token
    }
    const reqAxiosConfig: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const res = await axios.post('https://api.openslipverify.com/', reqBody, reqAxiosConfig)
    const resData = res.data

    if (resData['success'] === false){
        if (['ไม่พบสลิปในระบบ หรือจำนวนเงินไม่ถูกต้อง', '"รูปแบบรหัสของสลิปไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง"'].includes(resData['msg'])) return { success: false, err: SlipVerifyError.InvalidSlipOrQr }
        else if (resData['msg'] === 'ธนาคารล่มหรือระบบมีปัญหา กรุณาลองใหม่อีกครั้ง') return { success: false, err: SlipVerifyError.OpenSlipVerifyError }
        else if (resData['msg'] === 'ถึงขีดจำกัดการตรวจสอบสลิปแล้ว') return { success: false, err: SlipVerifyError.RateLimitError }
        else if (resData['msg'] === 'ตรวจพบการกระทำที่ขัดต่อนโยบาย Anti-Money Laundering (AML) ทางทีมงานจะส่งข้อมูลให้หน่วยงานที่เกี่ยวข้องต่อไป'){
            console.log("[ERR - SCARY] OSV returned AML Error! Expect police at your doorstep.")
            console.log("[ERR - SCARY] res: ", res.data)
            console.log("[ERR - SCARY] req: ", res.request.body)
            return { success: false, err: SlipVerifyError.AMLError }
        }
        else {
            console.log(res.data)
            return { success: false, err: SlipVerifyError.UnknownError }
        }
    }

    return {
        success: true,
        data: res.data.data
    }
}