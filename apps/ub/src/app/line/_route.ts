import crypto from 'crypto'
import { NextRequest } from 'next/server'

const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN!

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
                const getRes = await axios.get(`https://api.line.me/v2/bot/profile/${event.source.userId}`, {
                    headers: {  
                        Authorization: `Bearer ${channelAccessToken}`
                    }
                })
                if (getRes.status !== 200){
                    fastify.log.error(`Webhook Error: \n${getRes.data}`)
                }
                const { data } = getRes
                console.log(`added ${JSON.stringify(data)}`)
                // TODO: send greeting message
                await db.insert(users).values({
                    id: data.userId
                })
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
    fastify.log.info('webhook recieved')
    res.statusCode = 200
    return {}
}