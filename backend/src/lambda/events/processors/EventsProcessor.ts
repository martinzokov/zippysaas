import Stripe from "stripe";

export interface EventsProcessor {
    process(event: Stripe.Event)
}