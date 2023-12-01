import { ReactiveController, ReactiveControllerHost } from "lit";
import {
  QueryClient,
  QueryFunction,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
  QueryObserverResult,
} from "@tanstack/query-core";

export class QueryObserverController<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> implements ReactiveController
{
  host: ReactiveControllerHost;

  observer: QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>;

  observerResult: QueryObserverResult<TData, TError>;

  private unsubscribe(): void {}

  constructor(
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
  ) {
    this.observer = new QueryObserver(client, {
      queryFn: fn,
      queryKey: key,
      ...config,
    });

    (this.host = host).addController(this);

    this.observerResult = this.observer.getCurrentResult();
  }

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

export const createQueryObserver = <
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
  const controller = new QueryObserverController(host, client, key, fn, config);

  return controller.observerResult;
};
