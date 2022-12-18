export class CustomerSubscriptionInfo {
    userId: string;
    stripeCustomerId: string;
    subscriptionId: string;

    constructor(userId: string, stripeCustomerId: string, subscriptionId: string){
        this.userId = userId;
        this.stripeCustomerId = stripeCustomerId;
        this.subscriptionId = subscriptionId;
    }
}
