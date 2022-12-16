import { DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda";
import "source-map-support/register";
import Stripe from "stripe";
import { StripeCustomer } from "../../../storage/StripeCustomer";
import { StripeSubscription } from "../../../storage/StripeSubscription";
import { SubscriptionsRepository } from "../../../storage/SubscriptionsRepository";

import { createLogger } from "../../../utils/logger";
import { EventsProcessor } from "./EventsProcessor";

const stripe: Stripe = require('stripe')(process.env.STRIPE_API_KEY);
const logger = createLogger("CustomerProcessor");
const subscriptionsRepository = new SubscriptionsRepository();


export class CustomerEventsProcessor implements EventsProcessor{
    async process(event: Stripe.Event) {
        logger.info("Processing invoice event");
        
        switch (event.type) {
            case 'customer.created':
                await this.processCustomerUpdate(event);
            break;
            case 'customer.updated':
              await this.processCustomerUpdate(event);
            break;
            case 'customer.subscription.created':
                await this.processSubscription(event);
            break;
            case 'customer.subscription.updated':
                await this.processSubscription(event);
            break;
        }
    }

    private async processCustomerUpdate(event: Stripe.Event){
        try{
            let subscriptionObject: Stripe.Subscription = event.data.object as Stripe.Subscription;
            let customerResponse: Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer> = await stripe.customers.retrieve(subscriptionObject.id);
            let customer: Stripe.Customer = customerResponse as Stripe.Customer;

            let customerDto: StripeCustomer = new StripeCustomer(customer);
            await subscriptionsRepository.saveOrUpdateCustomer(customer.metadata.internalUserId, customer.id, customerDto)
        } catch(e){
            logger.error('errorp rocessing customer', e);
        }
    }

    private async processSubscription(event: Stripe.Event){
        try{
            let subscriptionObject: Stripe.Subscription = event.data.object as Stripe.Subscription;
            let subscription: Stripe.Response<Stripe.Subscription> = await stripe.subscriptions.retrieve(subscriptionObject.id)
            
            let subscriptionDto = new StripeSubscription(JSON.stringify(subscription), subscription.current_period_end);
            
            await subscriptionsRepository.saveOrUpdateSubscription(subscription.metadata.internalUserId, subscription.id, subscriptionDto);
        } catch(e){
            logger.error('errorp rocessing subscription', e);
        }
    }

}
