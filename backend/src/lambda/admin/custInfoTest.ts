import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";


import { createLogger } from "../../utils/logger";
import { StripeConfigRepository } from "../../storage/StripeConfigRepository";
import Stripe from "stripe";
import { StripeProduct } from "../../storage/models/StripeProduct";
import { ProductFeaturesConfig } from "./ProductFeaturesConfig";
import { Feature } from "../../storage/models/Feature";
import { SubscriptionsRepository } from "../../storage/SubscriptionsRepository";

const logger = createLogger("featuresSetup");

const stripe: Stripe = require('stripe')('sk_test_51LTpa2JDqfS8yHgviefD8PKqcnyTXKwn2Bp5OTL2VmhnstVKeHcYDF10g9Q9lENlerlOjKp2JocqdDd1jEG5WTWO00opvTH1c1');
const config: ProductFeaturesConfig = require('./productConfig.json')

const subsRepo = new SubscriptionsRepository();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

    await subsRepo.getCustomerDetails("3de17cec-bec7-4248-a747-f2dbd9051525", "sub_");


    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
        },
        body: ""
    }

};
