import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { useQuery } from "../../lib/lit-query/useQuery.js";
import "./product-information.js";
import { getProductsFn } from "../queries/products.js";
import { Product } from "../generated/products-api/index.js";

@customElement("top-rated-products")
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

  get topRatedProducts() {
    return [...(this.productsQuery?.data as Product[])]
      ?.sort((a, b) => (a.rating < b.rating ? 1 : -1))
      .slice(0, 4);
  }

  render() {
    return html`
      <h3>Top Rated Products</h3>

      ${this.productsQuery.isLoading
        ? html`<p>Loading...</p>`
        : html` <div class="products">
            ${this.topRatedProducts.map(
              (product) =>
                html`<product-information
                  .product=${product}
                  .canRate=${false}
                ></product-information>`
            )}
          </div>`}
    `;
  }
}
