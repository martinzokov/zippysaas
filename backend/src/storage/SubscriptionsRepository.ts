import { createLogger } from "../utils/logger";

import { StripeWebhookEvent, WebhookProcessingStatus } from "./StripeWebhookEvent";
import { AttributeValue, DocumentClient } from "aws-sdk/clients/dynamodb";
import { AbstractRepository } from "./AbstractRepository";
import { FEATURE_PREFIX, USER_PREFIX } from "./prefixes";
import { StripeSubscription } from "./StripeSubscription";
import * as DynamoDB from "aws-sdk/clients/dynamodb";
import { StripeCustomer } from "./StripeCustomer";
import { Feature } from "./models/Feature";

const logger = createLogger("subscriptionsRepository");

export class SubscriptionsRepository extends AbstractRepository{
  tableName: string = process.env.PAYMENTS_TABLE;
  index: string = process.env.INDEX_NAME;
  
  constructor() {
    super();
  }

  async saveCognitoUser(cognitoId: string) {
      logger.info("Storing webhook");
      
      const key = USER_PREFIX + cognitoId;

      await this.save(key, key, {});
  
      return key;
  } 

  async setWebhookStatus(eventId: string, status: WebhookProcessingStatus) {
    
    this.update(null, null, null, null);
    return eventId;
  } 

  async saveSubscription(cognitoUserId: string, subscriptionId: string, subscription: StripeSubscription){
    const userKey = USER_PREFIX + cognitoUserId;
    try{
      await this.save(userKey, subscriptionId, subscription);
    } catch(e){
      logger.error("error saving subscription: ", e)
    }
  }

  async updateSubscription(cognitoUserId: string, subscriptionId: string, subscription: StripeSubscription){
    const userKey = USER_PREFIX + cognitoUserId;

    try{
      await this.update(userKey, subscriptionId, "set body = :subscription, expiresAt = :expiresAt",{
        ":subscription": subscription.body as AttributeValue,
        ":expiresAt": subscription.expiresAt as AttributeValue
      });
      
    } catch(e){
      logger.error("error updating subscription: ", e)
    }
  }


  async findSubscription(subscriptionId: string): Promise<StripeSubscription> {
    try{
      let result: DynamoDB.ItemList = await this.queryBySortKey(subscriptionId);
      if(result.length === 1){
        let foundSubscription: StripeSubscription = result[0] as any;
        return foundSubscription;
      }
    } catch(e){
      logger.error("error getting subscription: ", e)
    }
    
    return null;
  } 

  async saveOrUpdateSubscription(cognitoUserId: string, subscriptionId: string, subscription: StripeSubscription){
    if(this.findSubscription(subscriptionId)){
      this.updateSubscription(cognitoUserId, subscriptionId, subscription);
    }else{
      this.saveSubscription(cognitoUserId,  subscriptionId, subscription);
    }
  }

  async saveCustomer(cognitoUserId: string, customerId: string, customer: StripeCustomer){
    const userKey = USER_PREFIX + cognitoUserId;
    try{
      await this.save(userKey, customerId, customer);
    } catch(e){
      logger.error("error saving customer: ", e)
    }
  }

  async updateCustomer(cognitoUserId: string, customerId: string, customer: StripeCustomer){
    const userKey = USER_PREFIX + cognitoUserId;
    try{
      await this.update(userKey, customerId, "set body = :subscription",{
        ":subscription": customer.body as AttributeValue,
      });
      
    } catch(e){
      logger.error("error updating subscription: ", e)
    }
  }


  async findCustomer(customerId: string): Promise<StripeCustomer> {
    try{
      let result: DynamoDB.ItemList = await this.queryBySortKey(customerId);
      if(result.length === 1){
        let foundSubscription: StripeCustomer = result[0] as any;
        return foundSubscription;
      }
    } catch(e){
      logger.error("error getting subscription: ", e)
    }
    
    return null;
  } 

  async saveOrUpdateCustomer(cognitoUserId: string, customerId: string, customer: StripeCustomer){
    if(this.findCustomer(customerId)){
      this.updateCustomer(cognitoUserId, customerId, customer);
    }else{
      this.saveCustomer(cognitoUserId,  customerId, customer);
    }
  }

  async getCustomerSubscription(cognitoUserId: string): Promise<StripeSubscription> {
    let stripeSubscriptionResult: StripeSubscription;
    try{
      const customerKey = USER_PREFIX + cognitoUserId;
      let result: DynamoDB.QueryOutput = await this.query("partitionKey = :partitionKey and begins_with(sortKey, :prefix) ", {
        ":partitionKey": customerKey as AttributeValue,
        ":prefix": "sub_" as AttributeValue
      });
      logger.info("result count "+ result)
      for (let res in result.Items){
        logger.info(res)
      }
      if(result.Count === 1){
        // cannot directly cast to StripeSubscription
        let resultAsAny = result.Items[0] as any;
        stripeSubscriptionResult = resultAsAny as StripeSubscription;
      } else{
        throw new Error("More than one subscription found");
      }

    } catch(e){
      logger.error("error getting subscription: ", e)
    }
    
    return stripeSubscriptionResult;
  }

  async getStripeCustomerId(cognitoUserId: string): Promise<string> {
    let stripeSubscriptionResult: string;
    try{
      const customerKey = USER_PREFIX + cognitoUserId;
      let result: DynamoDB.QueryOutput = await this.query("partitionKey = :partitionKey and begins_with(sortKey, :prefix) ", {
        ":partitionKey": customerKey as AttributeValue,
        ":prefix": "cus_" as AttributeValue
      });
      logger.info("customer key: " + customerKey)
      logger.info("result count "+ result.Count)
      for (let res in result.Items){
        logger.info(res)
      }
      if(result.Count === 1){
        // cannot directly cast to StripeSubscription
        let resultAsAny = result.Items[0] as any;
        stripeSubscriptionResult = (resultAsAny as StripeSubscription).sortKey;
      } else{
        throw new Error("More than one stripe customer found");
      }

    } catch(e){
      logger.error("error getting customer: ", e)
    }
    
    return stripeSubscriptionResult;
  }

  async getProductFeatures(productId: string): Promise<Feature[]>{
    let featuresResult: Feature[] = [];
    try{
      let result: DynamoDB.QueryOutput = await this.query("partitionKey = :partitionKey and begins_with(sortKey, :prefix) ", {
        ":partitionKey": productId as AttributeValue,
        ":prefix": FEATURE_PREFIX as AttributeValue
      });

      let resultsAsAny = result.Items as any[];
      featuresResult = resultsAsAny as Feature[];

    } catch(e){
      logger.error("error getting subscription: ", e)
    }

    return featuresResult;
  }
}
