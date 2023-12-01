import { html, css } from "lit";
import { customElement } from "lit/decorators.js";
import "./components/browse-products.js";
import "./components/shopping-cart.js";
import "./components/recommended-products.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { cart } from "./state/cart.js";

@customElement("shopping-app")
export class ShoppingApp extends MobxLitElement {
  static styles = css`
    :host {
      min-height: 100vh;
    }

    main {
      border-radius: 10px;
      max-width: 960px;
      background-color: #fff;
      min-height: 85vh;
      margin: 0 auto;
      padding: 20px;
      margin-top: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }

    main > * {
      margin-bottom: 20px;
    }
  `;

  render() {
    return html`
      <main>
        <h2>Shopping App</h2>

        <browse-products></browse-products>

        <shopping-cart></shopping-cart>

        ${cart.lastAddedSku &&
        html`<recommended-products
          sku=${cart.lastAddedSku}
        ></recommended-products>`}
      </main>
    `;
  }
}
