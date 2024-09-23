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
    userId: string
}

export const pushMessage = async ({req, res, client, userId } : Args): Promise<Response> => {  

    try {

            
        await client.pushMessage({
            to: userId,
            messages: [{ type: 'text', text: 'hello, world' }]
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
        
    // Return a successful message.
    return res.status(200).json({
        status: 'success',
      });
    }
  