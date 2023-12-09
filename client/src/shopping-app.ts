import { html, css } from "lit";
import { customElement } from "lit/decorators.js";
import "./components/browse-products.js";
import "./components/shopping-cart.js";
import "./components/recommended-products.js";
import "./components/top-rated-products.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { cart } from "./state/cart.js";
import { provideQueryClient } from "../lib/tanstack-query-lit.js";
import { queryClient } from "./clients/tanstack-query-client.js";

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

    .flex {
      display: flex;
      gap: 20px;
    }

    .flex-item {
      flex: 1;
    }
  `;

  client = provideQueryClient(this, queryClient);

  render() {
    return html`
      <main>
        <h2>Shopping App</h2>

        <top-rated-products></top-rated-products>

        <browse-products></browse-products>

        <div class="flex">
          <shopping-cart></shopping-cart>

          ${cart.lastAddedSku &&
          html`<recommended-products
            class="flex-item"
            sku=${cart.lastAddedSku}
          ></recommended-products>`}
        </div>
      </main>
    `;
  }
}
