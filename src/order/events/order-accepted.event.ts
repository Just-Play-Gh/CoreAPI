export class EventDriver {
  name: string;
  phoneNumber: string;
  driverId: string;
  driverPhoneNumber: number;
}
export class OrderAcceptedEvent {
  orderId: string;
  customerId: string;
  driverId: string;
  driverPhoneNumber: number;
  latlong: string;
  orderAccepted: boolean;
}
