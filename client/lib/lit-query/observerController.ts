import type { ReactiveController, ReactiveElement } from 'lit'

type Observer = {
  subscribe(listener: (result: any) => void): () => void
  getCurrentResult(): any
}

export class ObserverController implements ReactiveController {
  constructor(
    private host: ReactiveElement,
    private observer: Observer,
    private observerResult: any,
  ) {
    this.updateObserverResult(observer.getCurrentResult())
    ;(this.host = host).addController(this)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private unsubscribe() {}

  hostConnected(): void {
    this.unsubscribe = this.observer.subscribe((result) => {
      this.updateObserverResult(result)
      this.host.requestUpdate()
    })
  }

  hostDisconnected(): void {
    this.unsubscribe()
  }

  private updateObserverResult = (data: any) => {
    Object.keys(data).forEach((key) => {
      this.observerResult[key] = data[key]
    })
  }
}
