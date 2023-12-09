import { ReactiveController, ReactiveElement } from "lit";
import {
  MutationObserver,
  MutationObserverOptions,
  MutationObserverResult,
  QueryClient,
  QueryFunction,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
  QueryObserverResult,
} from "@tanstack/query-core";
import { ContextConsumer, ContextProvider, createContext } from "@lit/context";
import { Subscribable } from "@tanstack/query-core/build/legacy/subscribable";

const updateProperties = (source: any, target: any) => {
  Object.keys(source).forEach((key) => {
    target[key] = source[key];
  });
};

export const queryClientContext = createContext<QueryClient>("query-client");

export const provideQueryClient = (
  host: ReactiveElement,
  queryClient: QueryClient
): QueryClient => {
  new ContextProvider(host, {
    context: queryClientContext,
    initialValue: queryClient,
  });
  return queryClient;
};

export class ObserverController<R extends object>
  implements ReactiveController
{
  private host;

  observer;

  observerResult;

  constructor(
    host: ReactiveElement,
    observer: Subscribable<(result: R) => void> & { getCurrentResult: () => R },
    observerResult: any
  ) {
    this.observer = observer;
    this.observerResult = observerResult;
    updateProperties(observer.getCurrentResult(), this.observerResult);
    (this.host = host).addController(this);
  }

  private unsubscribe() {}

  hostConnected(): void {
    this.unsubscribe = this.observer.subscribe((result) => {
      updateProperties(result, this.observerResult);
      this.host.requestUpdate();
    });
  }

  hostDisconnected(): void {
    this.unsubscribe();
  }
}

export const useQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
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
  >
): QueryObserverResult<TData, TError> => {
  const observerResult: any = {};

  new ContextConsumer(host, {
    context: queryClientContext,
    subscribe: true,
    callback: (client) => {
      const queryObserver = new QueryObserver(client, {
        queryFn: fn,
        queryKey: key,
        ...config,
      });

      new ObserverController(host, queryObserver, observerResult);
    },
  });

  return observerResult;
};

export const useMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext extends { client: QueryClient } = { client: QueryClient }
>(
  host: ReactiveElement,
  config: MutationObserverOptions<TData, TError, TVariables, TContext>
): MutationObserverResult<TData, TError, TVariables, TContext> => {
  const observerResult: any = {};

  new ContextConsumer(host, {
    context: queryClientContext,
    callback: (client) => {
      const _onMutate = config.onMutate ?? (() => undefined);
      config.onMutate = (variables) => {
        const result = _onMutate(variables);

        const out =
          result && "then" in result
            ? result.then((ctx) => ({ ...(ctx ?? {}), client }))
            : ({ ...(result ?? {}), client } as any);

        return out;
      };

      const observer = new MutationObserver(client, config);

      new ObserverController(host, observer, observerResult);
    },
  });

  return observerResult;
};
