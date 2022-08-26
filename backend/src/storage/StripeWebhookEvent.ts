export class StripeWebhookEvent {
    idempotencyKey: string;
    body: any;
    processing_status: WebhookProcessingStatus;

    constructor(idempotencyKey: string, event: any){
        this.idempotencyKey = idempotencyKey;
        this.body = event;
        this.processing_status = WebhookProcessingStatus.PENDING;
    }
}

export enum WebhookProcessingStatus {
    PENDING,
    PROCESSING,
    PROCESSED,
    FAILED
}