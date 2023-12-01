import express from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import fetch from 'node-fetch';
import { readFileSync } from 'fs';
import config from './config.json' assert { type: "json" };

const { productsApiPort, customerTrendsApiPort, graphqlServerPort } = config;

const port = process.env.PORT || graphqlServerPort;

const productsApiUrl = `http://localhost:${productsApiPort}`;
const customerTrendsApiUrl = `http://localhost:${customerTrendsApiPort}`;

const schema = buildSchema(readFileSync('../schemas/graphql-schema.graphql', 'utf-8'));

const root = {
  recommendedProducts: async ({ sku }) => {
    const productsPromise = fetch(`${productsApiUrl}/products`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());

    const customerTrendsPromise = fetch(`${customerTrendsApiUrl}/trends`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());

    const [products, customerTrends] = await Promise.all([productsPromise, customerTrendsPromise]);

    const productGroupings = customerTrends.filter(_ => _.productSkus.includes(sku));

    const skuCounts = productGroupings
      .flatMap(_ => _.productSkus)
      .filter(_ => _ !== sku)
      .reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {});

    const topRecommendedProductSkus = Object.keys(skuCounts)
      .sort((a, b) => skuCounts[b] - skuCounts[a])
      .slice(0, 3);

    const response = {
      originalProduct: products.find(_ => _.sku === sku),
      recommendedProducts: topRecommendedProductSkus.map(sku => products.find(_ => _.sku === sku))
    };

    return response;
  }
};

const app = express();

app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(port);
console.log(`GraphQL is running @ http://localhost:${port}/graphql`);