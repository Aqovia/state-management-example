import { gql } from "graphql-request";

export const recommendedProductsQuery = gql`
  query RecommendedProducts($sku: ID!) {
    recommendedProducts(sku: $sku) {
      originalProduct {
        sku
        name
        price
        rating
      }
      recommendedProducts {
        sku
        name
        price
        rating
      }
    }
  }
`;
