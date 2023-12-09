import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "./product-information.js";
import { getProductsFn } from "../queries/products.js";
import { useQuery } from "../../lib/lit-query/useQuery.js";

@customElement("browse-products")
export class BrowseProducts extends LitElement {
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

  productsQuery = useQuery(this, ["products"], getProductsFn);

  render() {
    return html`
      <h3>Browse Collection</h3>

      ${this.productsQuery.isLoading
        ? html`<p>Loading...</p>`
        : html` <div class="products">
            ${this.productsQuery.data?.map(
              (product) =>
                html`<product-information
                  .product=${product}
                ></product-information>`
            )}
          </div>`}
    `;
  }
}
