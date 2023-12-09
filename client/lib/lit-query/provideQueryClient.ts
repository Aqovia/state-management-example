import { ContextProvider } from '@lit/context'
import { queryClientContext } from './queryClientContext'
import type { ReactiveElement } from 'lit'
import type { QueryClient } from '@tanstack/query-core'

export const provideQueryClient = (
  host: ReactiveElement,
  queryClient: QueryClient,
): QueryClient => {
  new ContextProvider(host, {
    context: queryClientContext,
    initialValue: queryClient,
  })
  return queryClient
}
