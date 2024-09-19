const https = require("https");
const express = require('express');

const app = express()
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const PORT = 8000

app.get('/', (req, res) => {
  res.send('Hello World')
})

const CHANNEL_ID = process.env.CHANNEL_ID
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN

app.post("/webhook", (req, res) => {
  console.log(req.body.events[0].messages)
  
  // ユーザーがボットにメッセージを送った場合、応答メッセージを送る
  if (req.body.events[0].type === "message") {
    // APIサーバーに送信する応答トークンとメッセージデータを文字列化する
    const dataString = JSON.stringify({
      // 応答トークンを定義
      replyToken: req.body.events[0].replyToken,
      // 返信するメッセージを定義
      messages: [
        {
          type: "text",
          text: "こんにちは、メッセージありがとうございます。",
        },
        {
          type: "text",
          text: "ご用件をお伺いします。",
        },
      ],
    });

    console.log(process.env.CHANNEL_ACCESS_TOKEN)

    // リクエストヘッダー。仕様についてはMessaging APIリファレンスを参照してください。
    const headers = {
      "Content-Type": "application/json",
      // biome-ignore lint/style/useTemplate: <explanation>
      Authorization: "Bearer " + CHANNEL_ACCESS_TOKEN,
    };

    // Node.jsドキュメントのhttps.requestメソッドで定義されている仕様に従ったオプションを指定します。
    const webhookOptions = {
      hostname: "api.line.me",
      path: "/v2/bot/message/reply",
      method: "POST",
      headers: headers,
      body: dataString,
    };

    // messageタイプのHTTP POSTリクエストが/webhookエンドポイントに送信された場合、
    // 変数webhookOptionsで定義したhttps://api.line.me/v2/bot/message/replyに対して
    // HTTP POSTリクエストを送信します。

    // リクエストの定義
    const request = https.request(webhookOptions, (res) => {
      res.on("data", (d) => {
        process.stdout.write(d);
      });
    });

    // エラーをハンドリング
    // request.onは、APIサーバーへのリクエスト送信時に
    // エラーが発生した場合にコールバックされる関数です。
    request.on("error", (err) => {
      console.error(err);
    });

    // 最後に、定義したリクエストを送信
    request.write(dataString);
    request.end();
  }  

});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
})