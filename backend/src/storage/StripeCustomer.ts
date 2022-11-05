export class StripeCustomer {
    sortKey: any;
    body: any;

    constructor(event: any){
        this.body = event;
    }
}
