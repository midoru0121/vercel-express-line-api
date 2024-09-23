# vercel-express-line-api

## 事前準備


* Vercelでアカウント作成します。
* このプロジェクトをForkしてGithub連携します。


### VercelへのデプロイとWebhook URLの設定

Vercelにデプロイして、URLを取得します。
`vercel-example-line-messaging-api.vercel.app` のようなURLが発行されます。 (URLはプロジェクトIDごとに異なります。)
Line Developerコンソール上で webhookの設定を行います。上記で発行されたURLに /webhook を付与して設定します。

`https://vercel-example-line-messaging-api.vercel.app` がVercelから発行されたURLだとすると、 `https://vercel-example-line-messaging-api.vercel.app/webhook` がwebhookとして、設定すべきURLとなります。


### Vercel上で環境変数を設定する。

環境変数はLine Developerコンソールで取得してください。


```shell
CHANNEL_SECRET: チャンネルシークレット 
CHANNEL_ACCESS_TOKEN: チャンネルアクセストークン (長期)
LINE_DEVELOPER_USER_ID: 開発者のユーザーID, pushメッセージを送信するために使います。
```

## エンドポイント

```
# Webhook
ユーザーが公式アカウントにメッセージを返信することで起動します。
```

```shell
# Pushメッセージ
curl -X POST https://vercel-express-line-api.vercel.app/pushMessage
```

