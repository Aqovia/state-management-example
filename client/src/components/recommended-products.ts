import { html, css, PropertyValueMap } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cart } from "../state/cart.js";
import { useQuery } from "../../lib/lit-query/useQuery.js";
import {
  RecommendedProductsQuery,
  RecommendedProductsQueryVariables,
} from "../generated/graphql-types/graphql.js";
import { graphqlClient } from "../clients/graphql-request-client.js";
import { recommendedProductsQuery } from "../queries/products.gql.js";
import { MobxLitElement } from "@adobe/lit-mobx";

@customElement("recommended-products")
export class RecommendedProducts extends MobxLitElement {
  static styles = css`
    :host {
      display: block;
      padding: 20px;
      border: solid 1px #ccc;
      border-radius: 10px;
    }
  `;

  @property({ type: String })
  sku?: string;

  recommendedProductsQuery = useQuery(
    this,
    ["recommended", { sku: this.sku }],
    () =>
      graphqlClient
        .request<RecommendedProductsQuery, RecommendedProductsQueryVariables>(
          recommendedProductsQuery,
          { sku: this.sku! }
        )
        .then((data) => data.recommendedProducts)
  );

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (_changedProperties.has("sku")) this.recommendedProductsQuery.refetch();
  }

  render() {
    if (this.recommendedProductsQuery.isLoading) return html`<p>Loading...</p>`;

    return html` <h3>Items You Might Like...</h3>
      <p>
        Because you recently added
        ${this.recommendedProductsQuery.data?.originalProduct.name} to your
        basket, we thought you might like:
      </p>
      <ul>
        ${this.recommendedProductsQuery.data?.recommendedProducts.map(
          (product) => html`<li>
            ${product!.name} - ${product!.price}
            <button @click=${() => cart.addToCart(product!)}>
              Add to Cart
            </button>
          </li>`
        )}
      </ul>`;
  }
}
