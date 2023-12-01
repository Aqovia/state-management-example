import { html, css, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cart } from "../state/cart.js";
import { queryClient } from "../clients/tanstack-query-client.js";
import {
  ProductRecommendations,
  RecommendedProductsQuery,
  RecommendedProductsQueryVariables,
} from "../generated/graphql-types/graphql.js";
import { graphqlClient } from "../clients/graphql-request-client.js";
import { recommendedProductsQuery } from "../graphql/queries.js";
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

  @state()
  recommendations?: ProductRecommendations;

  fetchRecommendedProducts() {
    if (!this.sku) {
      this.recommendations = undefined;
      return;
    }

    queryClient
      .fetchQuery(["recommended-products", this.sku], () =>
        graphqlClient.request<
          RecommendedProductsQuery,
          RecommendedProductsQueryVariables
        >(recommendedProductsQuery, { sku: this.sku! })
      )
      .then((data) => {
        this.recommendations = data.recommendedProducts!;
      });
  }

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (_changedProperties.has("sku")) this.fetchRecommendedProducts();
  }

  render() {
    if (!this.recommendations) return html`<p>Loading...</p>`;

    return html` <h3>Items You Might Like...</h3>
      <p>
        Because you recently added ${this.recommendations.originalProduct.name}
        to your basket, we thought you might like:
      </p>
      <ul>
        ${this.recommendations.recommendedProducts.map(
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
