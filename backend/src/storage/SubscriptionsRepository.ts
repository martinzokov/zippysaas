import { createLogger } from "../utils/logger";

import { StripeWebhookEvent, WebhookProcessingStatus } from "./StripeWebhookEvent";
import { AbstractRepository } from "./AbstractRepository";
import { USER_PREFIX } from "./prefixes";

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
}
