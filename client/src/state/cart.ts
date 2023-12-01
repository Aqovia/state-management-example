import { makeObservable, observable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { CartItem } from "../models/CartItem.js";
import { Product } from "../generated/products-api/index.js";

class CartState {
  constructor() {
    makeObservable(this);
    makePersistable(this, {
      name: "shopping-cart",
      properties: ["items", "lastAddedSku"],
      storage: window.localStorage,
    });
  }

  @observable
  items: CartItem[] = [];

  @observable
  lastAddedSku?: string = undefined;

  addToCart(product: Product) {
    const updatedItems = [...this.items];

    const existingItem = updatedItems.find((i) => i.sku === product.sku);
    if (existingItem) existingItem.quantity += 1;
    else updatedItems.push(new CartItem(product.sku, product.name));

    this.items = updatedItems;

    this.lastAddedSku = product.sku;
  }

  removeItem(sku: string) {
    this.items = this.items.filter((i) => i.sku !== sku);
    this.reviewCart();
  }

  emptyCart() {
    this.items = [];
    this.reviewCart();
  }

  itemsCount(): number {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  private reviewCart() {
    if (!this.items.find(_ => _.sku === this.lastAddedSku))
      this.lastAddedSku = undefined;
  }
}

export const cart = new CartState();
