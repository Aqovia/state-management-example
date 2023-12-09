import { QueryObserver } from '@tanstack/query-core'
import { ContextConsumer } from '@lit/context'
import { ObserverController } from './observerController'
import { queryClientContext } from './queryClientContext'
import type { ReactiveElement } from 'lit'
import type {
  QueryFunction,
  QueryKey,
  QueryObserverOptions,
  QueryObserverResult,
} from '@tanstack/query-core'

export const useQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  host: ReactiveElement,
  key: TQueryKey,
  fn: QueryFunction<TQueryFnData, TQueryKey>,
  config?: QueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >,
): QueryObserverResult<TData, TError> => {
  const observerResult: any = {}

  new ContextConsumer(host, {
    context: queryClientContext,
    subscribe: true,
    callback: (client) => {
      const observer = new QueryObserver(client, {
        queryFn: fn,
        queryKey: key,
        ...config,
      })

      new ObserverController(host, observer, observerResult)
    },
  })

  return observerResult
}
