import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";


import { createLogger } from "../../utils/logger";
import { StripeConfigRepository } from "../../storage/StripeConfigRepository";
import Stripe from "stripe";
const logger = createLogger("getExample");

const stripe: Stripe = require('stripe')(process.env.STRIPE_API_KEY);

const stripeConfigRepo = new StripeConfigRepository();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

    const portalConfig: Stripe.Response<Stripe.BillingPortal.Configuration> = await stripe.billingPortal.configurations.create({
        features: {
            customer_update: {
              allowed_updates: ['address', 'tax_id'],
              enabled: true,
            },
            payment_method_update: {enabled: true},
            invoice_history: {enabled: true},
            subscription_update:{
                enabled: true,
                default_allowed_updates: ['price'],
                products: [
                    {
                        product:'prod_MCF1MtyUit7bwA',
                        prices: ['price_1LTqXTJDqfS8yHgvelQopp3C']
                    },
                    {
                        product:'prod_MCEGxRUdXjT4xL',
                        prices: ['price_1LTpnqJDqfS8yHgvMBMOwZWX']
                    }
                ]
            }
          },
        business_profile: {
            privacy_policy_url: 'https://example.com/privacy',
            terms_of_service_url: 'https://example.com/terms',
        },
    });

    await stripeConfigRepo.saveBillingPortalConfiguration(portalConfig.id);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
        },
        body: ""
    }

};
