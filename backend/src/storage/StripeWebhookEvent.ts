export class StripeWebhookEvent {
    id: string;
    body: any;
    status: WebhookProcessingStatus;

    constructor(eventId: string, event: any){
        this.id = eventId;
        this.body = event;
        this.status = WebhookProcessingStatus.PENDING;
    }
}

export enum WebhookProcessingStatus {
    PENDING,
    PROCESSING,
    PROCESSED,
    FAILED
}