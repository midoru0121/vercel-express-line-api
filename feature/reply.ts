// Import all dependencies, mostly using destructuring for better view.
import {
    type webhook,
    HTTPFetchError,
    type messagingApi,
  } from '@line/bot-sdk';
import type { Request, Response } from 'express';


type Args = {
    req:  Request,
    res:  Response,
    client: messagingApi.MessagingApiClient
    events:  webhook.Event[]
}



export const execReply = async ({req, res, client, events} : Args): Promise<Response> => {  
      // Process all the received events asynchronously.
      const results = await Promise.all(
        events.map(async (event: webhook.Event) => {
          try {

            if (event.type !== 'message' || event.message.type !== 'text') {
                return;
            }

            if (!event.replyToken) {
                return;
            }

            await client.replyMessage({
                replyToken:event.replyToken,
                messages: [{
                  type: 'text',
                  text: event.message.text,
                }],
              });            
            
          } catch (err: unknown) {
            if (err instanceof HTTPFetchError) {
              console.error(err.status);
              console.error(err.headers.get('x-line-request-id'));
              console.error(err.body);
            } else if (err instanceof Error) {
              console.error(err);
            }
  
            // Return an error message.
            return res.status(500).json({
              status: 'error',
            });
          }
        })
      );

      // Return a successful message.
      return res.status(200).json({
        status: 'success',
        results,
      });
    }
  