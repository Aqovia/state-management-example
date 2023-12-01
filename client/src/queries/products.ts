import { productsApiClient } from "../clients/products-api-client.js";

export const getProductsFn = () => productsApiClient.getProducts();
