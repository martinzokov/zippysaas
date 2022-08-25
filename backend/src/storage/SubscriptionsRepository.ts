import { createLogger } from "../utils/logger";

import { StripeWebhookEvent, WebhookProcessingStatus } from "./StripeWebhookEvent";
import { AbstractRepository } from "./AbstractRepository";

const logger = createLogger("subscriptionsRepository");

export class SubscriptionsRepository extends AbstractRepository{
  tableName: string = process.env.PAYMENTS_TABLE;
  
  constructor() {
    super();
  }

  async saveCustomer(event: StripeWebhookEvent) {
      logger.info("Storing webhook");
      
      this.save(null, null, null);
  
      return event.id;
  } 

  async setWebhookStatus(eventId: string, status: WebhookProcessingStatus) {
    
    this.update(null, null, null, null);
    return eventId;
} 
}
