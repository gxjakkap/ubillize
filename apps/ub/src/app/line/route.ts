import { db } from '@ubillize/db'
import { tasks } from '@ubillize/db/schema'
import crypto from 'crypto'
import { NextRequest } from 'next/server'

const verifySignature = (bodyString: string, signature: string): boolean => {
    const x = crypto.createHmac("SHA256", process.env.LINE_CHANNEL_SECRET!).update(bodyString).digest("base64")

    return (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(x)))
}

export const POST = async (req: NextRequest) => {
    /*
     *  Verify LINE signature 
     */
    const sig = req.headers.get('x-line-signature')
    if (!sig) return { status: 403, err: 'missing signature' }
    const body = await req.json()
    const isVerified = verifySignature(JSON.stringify(body), sig)

    if(!isVerified){
        return new Response(JSON.stringify({ status: 403, err: 'wrong signature'}), { status: 403 })
    }

    if (!body){
        return new Response(JSON.stringify({}), { status: 200 })
    }

    if (body.events) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        body.events.forEach(async (event: any) =>{
            /*
            *   Follow event
            *   - add user to user table
            *   - send greeting message
            */
            if (event.type === 'follow') {
                await db.insert(tasks).values({ type: 'welcome', to: `${event.source.userId}`})
            }
            /*
            *   Unfollow event
            *   - remove user from table
            */
            else if (event.type === 'unfollow') {
                // TODO: add db logic for removing user from database
            }
        }) 
    }
    return new Response(JSON.stringify({}), { status: 200 })
}