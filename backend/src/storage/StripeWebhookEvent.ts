export class StripeWebhookEvent {
    id: string;
    body: any;
    processing_status: WebhookProcessingStatus;

    constructor(eventId: string, event: any){
        this.id = eventId;
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