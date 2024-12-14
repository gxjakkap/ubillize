import * as line from '@line/bot-sdk'
import axios from 'axios'
import { shortDateString, formatDateString } from '@ubillize/date'
import * as dotenv from 'dotenv'
import { InferSelectModel } from '@ubillize/db/orm'
import { bills } from '@ubillize/db/schema'

dotenv.config()

/* export interface BillsData{
    id: number,
    dateAdded: Date,
    dateDue: Date,
    elecUnit?: number | null,
    waterUnit?: number | null,
    electDueAmount?: number | null,
    waterDueAmount?: number | null,
    rentDueAmount: number,
    totalDueAmount: number,
    paid: boolean,
    slip?: string | null,
    archiveStatus: boolean,
    roomNo: string
}
 */

export type BillsData = InferSelectModel<typeof bills>

const CURRENCY_SYMBOL = '฿'
const BASE_URL = process.env.BASE_URL!

export async function sendMessage(message: line.Message, channelAccessToken: string, userId: string) {
    const headers = { 'Authorization': `Bearer ${channelAccessToken}`, 'Content-Type': 'application/json' }
    const body = {
        to: userId,
        messages: [message],
    }
    return axios.post('https://api.line.me/v2/bot/message/push', body, { headers: headers })
}

export const WelcomeMessage = () => {
  const msg: line.TextMessage = {
    type: 'text',
    text: `Thanks for adding us as your friend!🎉\n\nPlease register here:\n\n🔗 ${BASE_URL}/login`
  }
  return msg
}

export const BillAlert = (data: BillsData) => {
    const { id, roomNo, dateDue, dateAdded, rentDueAmount, electDueAmount, waterDueAmount, totalDueAmount } = data
    const msg: line.FlexMessage = {
        type: 'flex',
        altText: `Bill due for ${shortDateString(dateAdded.valueOf())}`,
        contents: {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": `Bill for ${shortDateString(dateAdded.valueOf())}`,
                "weight": "bold",
                "size": "xxl",
                "margin": "md"
              },
              {
                "type": "text",
                "text": `DUE ${formatDateString(dateDue.valueOf())}`,
                "color": "#FA0000"
              },
              {
                "type": "text",
                "text": `ROOM ${roomNo} - #${id.toString().padStart(5, '0')}`,
                "size": "xs",
                "color": "#aaaaaa",
                "wrap": true
              },
              {
                "type": "separator",
                "margin": "xxl"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "xxl",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Rent",
                        "size": "sm",
                        "color": "#555555",
                        "flex": 0
                      },
                      {
                        "type": "text",
                        "text": `${CURRENCY_SYMBOL} ${rentDueAmount.toFixed(2)}`,
                        "size": "sm",
                        "color": "#111111",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Electricity",
                        "size": "sm",
                        "color": "#555555",
                        "flex": 0
                      },
                      {
                        "type": "text",
                        "text": `${CURRENCY_SYMBOL} ${electDueAmount?.toFixed(2)}`,
                        "size": "sm",
                        "color": "#111111",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Water",
                        "size": "sm",
                        "color": "#555555",
                        "flex": 0
                      },
                      {
                        "type": "text",
                        "text": `${CURRENCY_SYMBOL} ${waterDueAmount?.toFixed(2)}`,
                        "size": "sm",
                        "color": "#111111",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "separator",
                    "margin": "xxl"
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "text",
                        "text": "TOTAL",
                        "size": "sm",
                        "color": "#555555"
                      },
                      {
                        "type": "text",
                        "text": `${CURRENCY_SYMBOL} ${totalDueAmount.toFixed(2)}`,
                        "size": "sm",
                        "color": "#111111",
                        "align": "end"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "separator",
                "margin": "xxl"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "margin": "md",
                "contents": [
                  {
                    "type": "button",
                    "action": {
                      "type": "uri",
                      "label": "Click to pay / View details",
                      "uri": `${BASE_URL}/tenant/bill/${data.id}`
                    }
                  }
                ]
              }
            ]
          },
          "styles": {
            "footer": {
              "separator": true
            }
          }
        }
    }
    return msg
}

export const BillPaidAlert = (data: BillsData) => {
  const msg: line.FlexMessage = {
    type: 'flex',
    altText: `Bill paid for ${shortDateString(data.dateAdded.valueOf())}`,
    contents: {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "Bill Paid",
            "weight": "bold",
            "size": "xxl",
            "margin": "md",
            "color": "#1DB446"
          },
          {
            "type": "text",
            "text": `Room ${data.roomNo} - #${data.id.toString().padStart(5, '0')}`,
            "size": "xs",
            "color": "#aaaaaa",
            "wrap": true
          },
          {
            "type": "separator",
            "margin": "xxl"
          },
          {
            "type": "box",
            "layout": "vertical",
            "margin": "xxl",
            "spacing": "sm",
            "contents": [
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "Month",
                    "size": "sm",
                    "color": "#555555",
                    "flex": 0
                  },
                  {
                    "type": "text",
                    "text": `${shortDateString(data.dateAdded.valueOf())}`,
                    "size": "sm",
                    "color": "#111111",
                    "align": "end"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "Payer",
                    "size": "sm",
                    "color": "#555555",
                    "flex": 0
                  },
                  {
                    "type": "text",
                    "text": "payername",
                    "size": "sm",
                    "color": "#111111",
                    "align": "end"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "Amount",
                    "size": "sm",
                    "color": "#555555",
                    "flex": 0
                  },
                  {
                    "type": "text",
                    "text": `${CURRENCY_SYMBOL} ${data.totalDueAmount.toFixed(2)}`,
                    "size": "sm",
                    "color": "#111111",
                    "align": "end"
                  }
                ]
              }
            ]
          },
          {
            "type": "separator",
            "margin": "xxl"
          },
          {
            "type": "button",
            "action": {
              "type": "uri",
              "label": "View Receipt",
              "uri": `${BASE_URL}/tenant/bill/${data.id}`
            }
          }
        ]
      },
      "styles": {
        "footer": {
          "separator": true
        }
      }
    }
  }
  return msg
}