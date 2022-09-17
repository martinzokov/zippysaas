export class SubscriptionDetailsResponse {
    subscriptionPlan: string;
    isActive: boolean;
    subscriptionFeatureCodes: string[];

    constructor(subscriptionPlan: string, isActive: boolean, subscriptionFeatureCodes: string[]){
        this.subscriptionPlan = subscriptionPlan;
        this.isActive = isActive;
        this.subscriptionFeatureCodes = subscriptionFeatureCodes
    }
}