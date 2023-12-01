# State Management Example

## Overview

This repository serves as an example of one approach to implementating state management in a `lit` front-end application. Both application state management (using `mobx`) and server state management (using `TanStack Query` and `graphql-request` for both REST and GraphQL) are covered.

Included is a `client` application, along with a `server` application (which itself is comprised of 2 REST APIs and a GraphQL server) for the client to query against.

## Getting Started

- Clone the repository
- Run `npm install`
  - This will install all client and server dependencies and perform all code-generation
- Run `npm start` to start the servers and the front-end application

## Server

### Products API

An API offering a list of products available for purchase.

### Customer Trends API

An API intended to be non-public facing, offering data on past customer order trends — specifically, which products have been purchased together.

### GraphQL Server

A GraphQL server exposing a single query, which, given a specific product, provides additional recommended products (utilising both the Products API and the Customer Trends API).

## Client

The client is a dummy shopping application, consisting of a `browse-products` component, a `shopping-cart` component and a `recommended-products` component. It allows for browsing products, adding (and removing) them from a shopping cart, and viewing additional recommended products.

### Application State Management

The application contains an example implementation of managing application state, in the form of a customer shopping cart.

The following are used:

- `mobx`
  - Providing state management functionality
- `lit-mobx`
  - Provides a component base class for writing Lit components that support `mobx` state management
- `mobx-persist-store`
  - To enable persistence of state across browser refreshes

### Server State Management

The application also contains examples of querying a REST API and querying a GraphQL server. The available products are retrieved from the Products REST API and the recommended products are retrieved from the GraphQL server.

The following are used:

- `@tanstack/query-core`
  - The query client is used for managing and fetching data, providing an efficient way of handling data fetching, caching, and state management
  - **Note.** The client itself is not used as a HTTP client — rather, it allows functions that contain the fetching logic to be provided
- `graphql-request`
  - A lightweight GraphQL client, which is used in conjunction with TanStack Query
- `@openapitools/openapi-generator-cli`
  - For code-generating types and code-generating an API client from an OpenAPI schema — the latter of which can be used in conjunction with TanStack Query
- `@graphql-codegen/cli`
  - For code-generating types from both a GraphQL schema and queries within the application

At the time of writing, TanStack Query does not have official bindings for Lit. As such, example bindings have been written for this application and can be found in `./client/lib/tanstack-query-lit.ts`.

## Schemas

In the `./schemas` directory, the following can be found:

- `products-api.yaml`
  - The OpenAPI schema for the Products API
- `customer-trends-api.yaml`
  - The OpenAPI schema for the Customer Trends API
- `graphql-schema.graphql`
  - The GraphQL schema

## Specific Examples

- OpenAPI Code Generation

  - [./client/package.json](./client/package.json) contains the generation code, in the `generate-api` script
  - [./client/src/generated/products-api/](./client/src/generated/products-api/) contains the generated models and API client 
    - **Note.** The application must be cloned and built for these code-generated files to appear

- GraphQL Code Generation

  - [./client/package.json](./client/package.json) contains the generation code, in the `generate-graphql` script
  - [./client/graphql-codegen.ts](./client/graphql-codegen.ts) contains the code-generation configuration
  - [./client/src/generated/graphql-types](./client/src/generated/graphql-types) contains the generated types
    - **Note.** The application must be cloned and built for these code-generated files to appear

- Server Querying

  - [./client/src/components/browse-products.ts](./client/src/components/browse-products.ts) contains an example of using TanStack Query with a query observer instance, making use of the custom Lit bindings
  - [./client/src/components/recommended-products.ts](./client/src/components/recommended-products.ts) contains an example of using the TanStack Query client directly, in combination with the GraphQL client

- Application State Management
  - [./client/src/state/cart.ts](./client/src/state/cart.ts) contains the shopping cart state class using `mobx`
  - [./client/src/components/](./client/src/components/) contains the components making use of the `mobx` application state, extending the `MobxLitElement` base class
