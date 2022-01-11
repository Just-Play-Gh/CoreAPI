export class PushOrderToDriverEvent {
  orderId: string;
  customerNumber: string;
  driverId: number;
  productId: string;
  latlong: string;
  location: string;
  distanceInKM: string;
  durationOfTrip: string;
  paidOrUnpaid: string;
}
