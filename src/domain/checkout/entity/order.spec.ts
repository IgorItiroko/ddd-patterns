import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let order = new Order("", "123", []);
    }).toThrowError("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("123", "", []);
    }).toThrowError("CustomerId is required");
  });

  it("should return error when removing an inexistent item", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
      const order = new Order("o1", "c1", [item]);
      order.remove_item("i2")
    }).toThrowError("Item not found")
  })

  it("should include a new item", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const order = new Order("o1", "c1", [item]);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
    order.include_item(item2)
    expect(order.items).toStrictEqual([item, item2])
  })

  it("should remove an item", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
      const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
      const order = new Order("o1", "c1", [item, item2]);
      order.remove_item("i2")
      expect(order.items).toStrictEqual([item])
    })
  })

  it("should throw error when items is empty", () => {
    expect(() => {
      let order = new Order("123", "123", []);
    }).toThrowError("Items are required");
  });

  it("should calculate total", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
    const order = new Order("o1", "c1", [item]);

    let total = order.total();

    expect(order.total()).toBe(200);

    const order2 = new Order("o1", "c1", [item, item2]);
    total = order2.total();
    expect(total).toBe(600);
  });

  it("should throw error if the item qte is less or equal zero 0", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 0);
      const order = new Order("o1", "c1", [item]);
    }).toThrowError("Quantity must be greater than 0");
  });
});
