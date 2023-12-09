import { html, css } from "lit";
import { MobxLitElement } from "@adobe/lit-mobx";
import { customElement } from "lit/decorators.js";
import { cart } from "../state/cart.js";

@customElement("shopping-cart")
export class ShoppingCart extends MobxLitElement {
  static styles = css`
    :host {
      display: block;
      padding: 20px;
      border: solid 1px #ccc;
      border-radius: 10px;
    }
  `;

  render() {
    return html`
      <h3>Shopping Cart</h3>

      ${cart.itemsCount} item(s) in your cart
      ${cart.items?.length
        ? html`
            ${cart.items.map(
              (item) =>
                html`<p>
                  <button @click=${() => cart.removeItem(item.sku)}>❌</button>
                  ${item.quantity}x ${item.name}
                </p>`
            )}

            <p>
              <button @click=${() => cart.emptyCart()}>Empty Cart</button>
            </p>
          `
        : html`<p>Nothing in your cart</p>`}
    `;
  }
}
