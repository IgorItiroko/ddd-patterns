import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      { 
        customer_id: entity.customerId,
        total: entity.total(),
      }, 
      {
        where: { id: entity.id },
      }
    );

    await Promise.all(entity.items.map(async (item) => {
      await OrderItemModel.upsert({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      });
    }));
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try{
      orderModel = await OrderModel.findOne(
        {
          where: {
            id,
          },
          include: [{ model: OrderItemModel }],
          rejectOnEmpty: true
        }
      );
    } catch (error) {
      throw new Error("Order not Found")
    }
    const items = orderModel.items.map((item) => (
      new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
    ))
    const order = new Order(id, orderModel.customer_id, items)
    return order
  }

  async findAll(): Promise<Order[]>{
    let orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });

    const orders = orderModels.map((orderModel) => {
      const items = orderModel.items.map((item) => (
        new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
      ))
      const order = new Order(orderModel.id, orderModel.customer_id, items)
      return order
    })
    return orders
  }
}
