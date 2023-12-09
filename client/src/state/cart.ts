import { autorun, makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { CartItem } from "../models/CartItem.js";
import { Product } from "../generated/products-api/index.js";

class CartState {
  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "shopping-cart",
      properties: ["items", "lastAddedSku"],
      storage: window.localStorage,
    });
  }

  items: CartItem[] = [];

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
  }

  emptyCart() {
    this.items = [];
  }

  get itemsCount(): number {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  }
}

export const cart = new CartState();

autorun(() => {
  if (!cart.items.find((_) => _.sku === cart.lastAddedSku))
    cart.lastAddedSku = undefined;
});
