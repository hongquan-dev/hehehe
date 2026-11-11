import { defineConfig } from 'orval'

/**
 * Sinh code gọi API + hook TanStack Query từ OpenAPI (springdoc) của từng microservice.
 * Chạy: `npm run api:gen` (backend phải đang chạy và bật springdoc-openapi).
 * Mỗi service một khối, output riêng trong src/api/generated/<service>.
 */
export default defineConfig({
  auth: {
    input: {
      target: process.env.ORVAL_AUTH_SPEC ?? 'http://localhost:8081/v3/api-docs',
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/generated/auth/endpoints',
      schemas: 'src/api/generated/auth/model',
      client: 'react-query',
      httpClient: 'axios',
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: 'src/api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
})
