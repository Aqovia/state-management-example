import { css, html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { customElement, property } from "lit/decorators.js";
import { cart } from "../state/cart.js";
import { Product } from "../generated/products-api/index.js";
import { productsApiClient } from "../clients/products-api-client.js";
import { useMutation } from "@aqovia/lit-query";

@customElement("product-information")
export class ProductInformation extends MobxLitElement {
  static styles = css`
    .stars {
      color: gray;
    }

    .stars .filled {
      color: orange;
    }

    .clickable {
      cursor: pointer;
    }
  `;

  @property({ type: Object })
  product!: Product;

  @property({ type: Boolean })
  canRate = true;

  ratingMutation = useMutation(this, {
    mutationFn: (rating: number) =>
      productsApiClient.rateProduct({
        sku: this.product.sku,
        rateProductRequest: { rating },
      }),
    onSuccess: (_data, _variables, context) => {
      context?.client.invalidateQueries({ queryKey: ["products"] });
    },
  });

  renderRating(product: Product) {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      stars.push(
        html`<span
          class=${classMap({
            filled: product.rating > i,
            clickable: this.canRate,
          })}
          @click=${() => this.canRate && this.ratingMutation.mutate(i + 1)}
          >&#9733;</span
        >`
      );
    }

    return html`<div class="stars">${stars}</div>`;
  }

  render() {
    return html`<div>
      <h4>${this.product.name}</h4>
      ${this.renderRating(this.product)}
      <p>${this.product.price}</p>
      <button @click=${() => cart.addToCart(this.product)}>Add to Cart</button>
    </div> `;
  }
}
