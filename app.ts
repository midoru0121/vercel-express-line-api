// https://line.github.io/line-bot-sdk-nodejs/
import * as line from '@line/bot-sdk';
import express from "express";

import { execReply } from './feature/reply';
import type { webhook } from '@line/bot-sdk';
import { pushMessage } from './feature/pushMessage';

// 環境変数を定義
const PORT = process.env.PORT || 8000
const CHANNEL_SECRET = process.env.CHANNEL_SECRET || ""
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN || ""

// LINE開発者用のユーザID, pushMessageで使用
const LINE_DEVELOPER_USER_ID = process.env.LINE_DEVELOPER_USER_ID || ""

if (!CHANNEL_SECRET) {
  throw new Error("CHANNEL_SECRET is not defined")
}

if (!CHANNEL_ACCESS_TOKEN) {
  throw new Error("CHANNEL_ACCESS_TOKEN is not defined")
}

const app = express()
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// ヘルスチェック
app.get('/', (req, res) => {
  res.send('Hello World')
})

// create LINE SDK config from env variables
const config = {
  channelSecret: CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: CHANNEL_ACCESS_TOKEN
});


// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post("/webhook", line.middleware(config), async (req, res) => {
  try {
    const callbackRequest: webhook.CallbackRequest = req.body;
    const events: webhook.Event[] = callbackRequest.events;
  
    
    await execReply({
      req, 
      res, 
      client,
      events
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Something broke!')
  }
  
});

app.post("/pushMessage", async (req, res) => {
  try {
    console.log("LINE_DEVELOPER_USER_ID", LINE_DEVELOPER_USER_ID)
  
    
    await pushMessage({
      req, 
      res, 
      client,
      userId: LINE_DEVELOPER_USER_ID
      
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Something broke!')
  }
})


app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
})