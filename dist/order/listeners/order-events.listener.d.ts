import { AppGateway } from 'src/app.gateway';
import { OrderAcceptedEvent } from '../events/order-accepted.event';
import { OrderCreatedEvent } from '../events/order-created.event';
export declare class OrderEventListeners {
    private readonly appGateway;
    constructor(appGateway: AppGateway);
    handleOrderCreated(event: OrderCreatedEvent): void;
    handleOrderAccepted(event: OrderAcceptedEvent): void;
}
