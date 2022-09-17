import { createLogger } from "../utils/logger";

import { StripeWebhookEvent, WebhookProcessingStatus } from "./StripeWebhookEvent";
import { AttributeValue, DocumentClient } from "aws-sdk/clients/dynamodb";
import { AbstractRepository } from "./AbstractRepository";
import { BILLING_CONFIG_PREFIX, FEATURE_PREFIX, USER_PREFIX } from "./prefixes";
import { StripeSubscription } from "./StripeSubscription";
import * as DynamoDB from "aws-sdk/clients/dynamodb";
import { StripeCustomer } from "./StripeCustomer";
import Stripe from "stripe";
import { StripeProduct } from "./models/StripeProduct";
import { Feature } from "./models/Feature";
import ShortUniqueId from "short-unique-id";

const logger = createLogger("subscriptionsRepository");
const uid = new ShortUniqueId({ length: 6 });

export class StripeConfigRepository extends AbstractRepository{
  tableName: string = process.env.PAYMENTS_TABLE;
  index: string = process.env.INDEX_NAME;
  
  constructor() {
    super();
  }

  async saveBillingPortalConfiguration(billingPortalConfigId: string) {
      logger.info("Billing portal config");

      await this.save(BILLING_CONFIG_PREFIX, billingPortalConfigId, {});
  
      return billingPortalConfigId;
  } 

  async findBillingPortalConfiguration(): Promise<string>{

    let result: DynamoDB.ItemList = await this.queryByPartitionKey(BILLING_CONFIG_PREFIX);
    const portalConfigId = result[0] as any;

    return portalConfigId.sortKey;
  }

  async saveProduct(product: StripeProduct): Promise<string>{
    const key = product.productId;
    await this.save(key, key, product);

    return key;
  }

  async saveProductFeatures(productId: string, features: Feature[]): Promise<string>{
    const partitionKey = productId;

    for( let feature of features){
      const sortKey = FEATURE_PREFIX + uid();

      await this.save(partitionKey, sortKey, feature);  
    }
    
    return partitionKey;
  }

}
