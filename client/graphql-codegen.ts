import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "../schemas/graphql-schema.graphql",
  documents: "src/graphql/**/*.ts",
  generates: {
    "src/generated/graphql-types/": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
