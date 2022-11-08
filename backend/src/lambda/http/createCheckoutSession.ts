import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";


import { createLogger } from "../../utils/logger";
import { parseUserEmail, parseUserId } from "../../auth/utils";
import Stripe from "stripe";
const logger = createLogger("getExample");

const stripe: Stripe = require('stripe')('sk_test_51LTpa2JDqfS8yHgviefD8PKqcnyTXKwn2Bp5OTL2VmhnstVKeHcYDF10g9Q9lENlerlOjKp2JocqdDd1jEG5WTWO00opvTH1c1');


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
      success_url: origin + "/?success=true&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: origin + "/?canceled=true",
      //customer_email: userEmail,
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
//   try {
//     return {
//       statusCode: 200,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Credentials": true,
//       },
//       body: JSON.stringify({
//         message: "Hello, ZippySaaS!"
//       }),
//     };
//   } catch (error) {
//     logger.error(`error during example fetch ${error}`);
//   }
};
