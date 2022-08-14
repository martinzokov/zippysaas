import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";


import { createLogger } from "../../utils/logger";
const logger = createLogger("getExample");

const stripe = require('stripe')('sk_test_51LTpa2JDqfS8yHgviefD8PKqcnyTXKwn2Bp5OTL2VmhnstVKeHcYDF10g9Q9lENlerlOjKp2JocqdDd1jEG5WTWO00opvTH1c1');


export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

    // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    // Typically this is stored alongside the authenticated user in your database.
    //const eventBody = event.body.session_id as any;
    //console.log(JSON.stringify(eventBody))
    const session_id  = event.queryStringParameters.session_id;
    console.log("session_id is: "+ session_id)
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    // This is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const returnUrl = "http://localhost:3000";

    const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
    });

    return {
        statusCode: 303,
        headers: {
            "Location": portalSession.url,
        },
        body: ""
    }

};
