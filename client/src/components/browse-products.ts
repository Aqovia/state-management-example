import { html, css } from "lit";
import { MobxLitElement } from "@adobe/lit-mobx";
import { customElement } from "lit/decorators.js";
import { cart } from "../state/cart.js";
import { createQueryObserver } from "../../lib/tanstack-query-lit.js";
import { productsApiClient } from "../clients/products-api-client.js";
import { queryClient } from "../clients/tanstack-query-client.js";

@customElement("browse-products")
export class BrowseProducts extends MobxLitElement {
  static styles = css`
    :host {
      display: block;
      padding: 20px;
      border: solid 1px #ccc;
      border-radius: 10px;
    }

    .products {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 10px;
    }
  `;

  productsQuery = createQueryObserver(this, queryClient, ["products"], () =>
    productsApiClient.productsGet()
  );

  render() {
    return html`
      <h3>Browse Collection</h3>

      ${this.productsQuery.isLoading
        ? html`<p>Loading...</p>`
        : html` <div class="products">
            ${this.productsQuery.data?.map(
              (product) => html`<div>
                <h4>${product.name}</h4>
                <p>${product.price}</p>
                <button @click=${() => cart.addToCart(product)}>
                  Add to Cart
                </button>
              </div>`
            )}
          </div>`}
    `;
  }
}
