export class StripeSubscription {
    sortKey: string;
    body: any;
    expiresAt: number;

    constructor(event: any, expiresAt: number){
        this.body = event;
        this.expiresAt = expiresAt;
    }
}
