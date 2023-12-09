import { createContext } from '@lit/context'
import type { QueryClient } from '@tanstack/query-core'

export const queryClientContext = createContext<QueryClient>('query-client')
