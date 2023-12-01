import { ReactiveController, ReactiveControllerHost } from "lit";
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
import { Subscribable } from "@tanstack/query-core/build/lib/subscribable";

export class ObserverController<R extends object, Label extends PropertyKey>
  implements ReactiveController
{
  private host;

  observer;

  observerResult;

  constructor(
    host: ReactiveControllerHost,
    observer: Subscribable<(result: R) => void> & { getCurrentResult: () => R }
  ) {
    (this.host = host).addController(this);
    this.observer = observer;
    this.observerResult = this.observer.getCurrentResult() as any;
  }

  private unsubscribe() {}

  hostConnected(): void {
    this.unsubscribe = this.observer.subscribe((result) => {
      Object.keys(result).forEach((key) => {
        (this.observerResult as any)[key] = (result as any)[key];
      });
      this.host.requestUpdate();
    });
  }

  hostDisconnected(): void {
    this.unsubscribe();
  }
}

export const createQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  host: ReactiveControllerHost,
  client: QueryClient,
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
  const queryObserver = new QueryObserver(client, {
    queryFn: fn,
    queryKey: key,
    ...config,
  });
  const controller = new ObserverController(host, queryObserver);

  return controller.observerResult;
};

export const createMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext extends { client: QueryClient } = { client: QueryClient }
>(
  host: ReactiveControllerHost,
  client: QueryClient,
  config: MutationObserverOptions<TData, TError, TVariables, TContext>
): MutationObserverResult<TData, TError, TVariables, TContext> => {
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

  const controller = new ObserverController(host, observer);

  return controller.observerResult;
};
