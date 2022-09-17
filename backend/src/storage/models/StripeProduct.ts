export class StripeProduct {
    productId: string;
    active: boolean;
    data: any;

    constructor(productId: string, active: boolean, data: any){
        this.productId = productId;
        this.active = active;
        this.data = data;
    }
}
