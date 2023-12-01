export class CartItem {
  sku: string;

  name: string;

  quantity: number;

  constructor(sku: string, name: string, quantity: number = 1) {
    this.sku = sku;
    this.name = name;
    this.quantity = quantity;
  }
}
