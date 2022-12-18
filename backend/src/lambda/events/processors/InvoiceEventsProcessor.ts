import { DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda";
import "source-map-support/register";
import Stripe from "stripe";
import { StripeSubscription } from "../../../storage/StripeSubscription";
import { SubscriptionsRepository } from "../../../storage/SubscriptionsRepository";

import { createLogger } from "../../../utils/logger";
import { EventsProcessor } from "./EventsProcessor";

const stripe: Stripe = require('stripe')(process.env.STRIPE_API_KEY);
const logger = createLogger("InvoiceProcessor");
const subscriptionsRepository = new SubscriptionsRepository();


export class InvoiceEventsProcessor implements EventsProcessor{
    async process(event: Stripe.Event) {
        logger.info("Processing invoice event");
        switch (event.type) {
            case 'invoice.payment_succeeded':
                await this.processPaymentSucceeded(event);
            break;
            case 'invoice.payment_failed':
                // TODO define what happens if payment doesn't succeed
            break;
        }
    }

    private async processPaymentSucceeded(event: Stripe.Event){
        try{
            let invoiceObject: Stripe.Invoice = event.data.object as Stripe.Invoice;
            const retrievedInvoice: Stripe.Response<Stripe.Invoice> = await stripe.invoices.retrieve(invoiceObject.id);
            for(let line of retrievedInvoice.lines.data){
                let subscription: Stripe.Response<Stripe.Subscription> = await stripe.subscriptions.retrieve(line.subscription)
                
                let subscriptionDto = new StripeSubscription(JSON.stringify(subscription), subscription.current_period_end);
                
                await subscriptionsRepository.saveOrUpdateSubscription(subscription.metadata.internalUserId, subscription.id, subscriptionDto);
            }
        } catch(e){
            logger.error('error processing invoice',e)
        }
    }

}
