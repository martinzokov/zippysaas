import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";


import { createLogger } from "../../utils/logger";
import { parseUserEmail, parseUserId } from "../../auth/utils";
const logger = createLogger("getExample");

const stripe = require('stripe')('sk_test_51LTpa2JDqfS8yHgviefD8PKqcnyTXKwn2Bp5OTL2VmhnstVKeHcYDF10g9Q9lENlerlOjKp2JocqdDd1jEG5WTWO00opvTH1c1');


export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const jwt = event.headers['Authorization'].split(' ')[1];
    const userEmail = parseUserEmail(jwt);
    const userId = parseUserId(jwt);

    const prices = await stripe.prices.list({
        lookup_keys: [event.queryStringParameters.lookup_key],
        expand: ['data.product'],
      });
    console.log("prices from stripe: "+ JSON.stringify(prices))
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
          {
          price: prices.data[0].id,
          // For metered billing, do not pass quantity
          quantity: 1,

          },
      ],
      mode: 'subscription',
      success_url: "http://localhost:3000/?success=true&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/?canceled=true",
      customer_email: userEmail,
      metadata: {
        internalUserId: userId
      }
    });
    

    return {
    statusCode: 303,
    headers: {
        "Location": session.url,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
    },
    body: ""
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
