import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Product } from 'src/product/entities/product.entity';
import { BaseService } from 'src/resources/base.service';
import { createQueryBuilder } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderLog, OrderLogEventMessages } from './entities/order-logs.entity';
import { Order, OrderStatusType } from './entities/order.entity';

@Injectable()
export class OrderService extends BaseService {
  constructor(private readonly httpService: HttpService) {
    super(Order);
  }

  async store(createOrderDto: CreateOrderDto, customer): Promise<Order> {
    const product = await Product.findOne({
      id: createOrderDto.productId,
    });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);
    }
    try {
      const order = Order.create(createOrderDto);
      order.status = OrderStatusType.Pending;
      order.customerId = createOrderDto.customerId || customer.id;
      order.orderId = new Date().toISOString().replace(/\D/g, '');
      order.pricePerLitre = product.pricePerLitre;
      order.totalAmount = order.amount; // +taxes
      order.customerFullName =
        createOrderDto.customerFullName ||
        customer.firstName + ' ' + customer.lastName;
      const createdOrder = await Order.save(order).catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
      // Ideally should be pushed to queue/async
      createdOrder.createLog(OrderLogEventMessages.Created).catch((err) => {
        console.log('An error occured while creating event log');
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
      return createdOrder;
    } catch (error) {
      console.log('An error occured', error);
      throw new HttpException('Sorry an error occured', HttpStatus.BAD_REQUEST);
    }
  }

  async getMyOrders(
    options: IPaginationOptions,
    filter = {},
  ): Promise<Pagination<Order>> {
    const orderRepository = createQueryBuilder(Order)
      .where(filter)
      .orderBy({ created: 'DESC' });

    const orders = await paginate<Order>(orderRepository, options);
    if (!orders['items'])
      throw new HttpException('No orders were found', HttpStatus.NOT_FOUND);
    return orders;
  }

  async acceptOrder(driverId: string, orderId: string): Promise<Order> {
    const order = await Order.findOne(orderId);
    if (!order)
      throw new HttpException('Order Not Found', HttpStatus.NOT_FOUND);

    if (!((await order.isPending()) || order.hasBeenAssigned())) {
      console.log(
        'Driver cannot accpet this order. Order has already been assigned or is not longer available',
      );
      throw new HttpException(
        'Sorry the order has either been assigned or is not pending anymore',
        HttpStatus.BAD_REQUEST,
      );
    }
    order.driverId = driverId;
    const acceptedOrder = await Order.save(order);
    if (!acceptedOrder.driverId) {
      acceptedOrder.createLog(OrderLogEventMessages.Accepted).catch((err) => {
        console.log('An error occured while creating event log');
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
    }
    return acceptedOrder;
  }

  // For admins to reassign a driver to the order
  async assignDriverToOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const { driverId } = updateOrderDto;
    const order = await Order.findOne(id);
    if (!order)
      throw new HttpException('Order Not Found', HttpStatus.NOT_FOUND);

    if (!(await order.isPending())) {
      throw new HttpException(
        'You cannot reassign a driver when the order is completed or cancelled',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Send sms/notification to new driver
    order.driverId = driverId;
    const assignedOrder = await Order.save(order);
    if (!assignedOrder.driverId) {
      // Should not fail, put in a queue or something and process really quickly and allow it to retry. A fifo queue maybe?
      assignedOrder.createLog(OrderLogEventMessages.Assigned).catch((err) => {
        console.log('An error occured while creating event log');
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
    }
    return assignedOrder;
  }

  // Check if is customer first and then check if customer owns this
  async cancelOrder(orderId, customer): Promise<Order> {
    const order = await Order.findOne({ id: orderId.id });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.BAD_REQUEST);
    }
    if (order.customerId !== customer.id) {
      console.log(order, customer);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const cancelledOrder = await order.cancel();
    cancelledOrder.createLog(OrderLogEventMessages.Cancelled).catch((err) => {
      console.log('An error occured while creating event log');
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
    return cancelledOrder;
  }

  async getOrderLogs(orderId): Promise<OrderLog[]> {
    const orderLogs = await OrderLog.find({ orderId: orderId.id });
    return orderLogs;
  }

  // async findNearestDriver(customerLatlong) {
  //   // Call google with coordinates
  //   // cache for 10 seconds
  //   // Return nearest driver with shortest distance and time

  //   const config = {
  //     method: 'get',
  //     url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=40.6655101%2C-73.89188969999998&destinations=40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626&key=YOUR_API_KEY',
  //     headers: {},
  //   };

  //   config
  //     .then(function (response) {
  //       console.log(JSON.stringify(response.data));
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }
}
