import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";


import { createLogger } from "../../utils/logger";
import { parseUserEmail, parseUserId } from "../../auth/utils";
import Stripe from "stripe";
const logger = createLogger("checkoutHandler");

const stripe: Stripe = require('stripe')(process.env.STRIPE_API_KEY);


export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const origin = event.headers['origin'];
    const jwt = event.headers['Authorization'].split(' ')[1];
    const userEmail = parseUserEmail(jwt);
    const userId = parseUserId(jwt);

    const customersResult: Stripe.Response<Stripe.ApiList<Stripe.Customer>> = await stripe.customers.list({email: userEmail})

    let customer: Stripe.Customer;
    if(customersResult.data.length === 0){
      logger.warn('no customer record found, creating Stripe customer');
      const customerCreateResponse: Stripe.Response<Stripe.Customer> = await stripe.customers.create({
        email: userEmail,
        metadata: {
          internalUserId: userId
        }
      });

      customer = customerCreateResponse
    } else{
      customer = customersResult.data[0];
    }
    
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
          {
          price: event.queryStringParameters.price,
          // For metered billing, do not pass quantity
          quantity: 1,

          },
      ],
      mode: 'subscription',
      success_url: origin + "/",
      cancel_url: origin + "/",
      customer: customer.id,
      client_reference_id: userId,
      subscription_data: {
        metadata: {
          internalUserId: userId
        }
      }
    });
    

    return {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({"sessionUrl": session.url})
    }
};
