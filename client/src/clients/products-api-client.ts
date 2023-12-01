import { DefaultApi as ProductsApi } from "../generated/products-api/apis/index.js";
import { Configuration as ProductsApiConfiguration } from "../generated/products-api/runtime.js";
import * as config from "../../config.json";

export const productsApiClient = new ProductsApi(
  new ProductsApiConfiguration({ basePath: config.productsApiUrl })
);
