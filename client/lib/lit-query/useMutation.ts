import { MutationObserver } from '@tanstack/query-core'
import { ContextConsumer } from '@lit/context'
import { queryClientContext } from './queryClientContext'
import { ObserverController } from './observerController'
import type { ReactiveElement } from 'lit'
import type {
  MutationObserverOptions,
  MutationObserverResult,
  QueryClient,
} from '@tanstack/query-core'

export const useMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext extends { client: QueryClient } = { client: QueryClient },
>(
  host: ReactiveElement,
  config: MutationObserverOptions<TData, TError, TVariables, TContext>,
): MutationObserverResult<TData, TError, TVariables, TContext> => {
  const observerResult: any = {}

  new ContextConsumer(host, {
    context: queryClientContext,
    callback: (client) => {
      const _onMutate = config.onMutate ?? (() => undefined)
      config.onMutate = (variables) => {
        const result = _onMutate(variables)

        const out =
          result && 'then' in result
            ? result.then((ctx) => ({ ...(ctx ?? {}), client }))
            : ({ ...(result ?? {}), client } as any)

        return out
      }

      const observer = new MutationObserver(client, config)

      new ObserverController(host, observer, observerResult)
    },
  })

  return observerResult
}
