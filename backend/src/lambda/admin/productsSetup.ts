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

const logger = createLogger("featuresSetup");

const stripe: Stripe = require('stripe')(process.env.STRIPE_API_KEY);
const config: ProductFeaturesConfig = require('./productConfig.json')

const stripeConfigRepo = new StripeConfigRepository();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

    const products: Stripe.Response<Stripe.ApiList<Stripe.Product>> = await stripe.products.list();
    console.log("adding products: ", products.data);
    for(let product of products.data){
        let internalDto = new StripeProduct(product.id, product.active, JSON.stringify(product));
        logger.info("saving product ", internalDto.productId)
        await stripeConfigRepo.saveProduct(internalDto);
        
        const features: Feature[] = config.productsConfig[product.id];
        if(features && features.length > 0){
          logger.info("found features ", features);
          await stripeConfigRepo.saveProductFeatures(product.id, features);
        }else{
          logger.warn("no features configured for product ", product.id)
        }
        
    }


    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
        },
        body: ""
    }

};
