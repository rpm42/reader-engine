import { BehaviorSubject, Subject, of, asapScheduler } from 'rxjs'
import { withLatestFrom, concatMap } from 'rxjs/operators'
import TriggerSubject from './trigger-subject'

interface GenericAction {
  type: string | number
  data?: any
}

type WaitingAction<S, AA> = [expr: (srate: S) => boolean, action: AA]

abstract class StateMachineBase<S, AA> {
  protected state$: BehaviorSubject<S>
  protected action$: Subject<AA> = new Subject<AA>()
  protected dispatch = (a: AA) => this.action$.next(a)
  protected abstract reductor: (action: AA, state: S) => S
  constructor(initial: S) {
    this.state$ = new BehaviorSubject<S>(initial)
  }
}

export abstract class StateMachine<S, AA extends GenericAction = GenericAction> extends StateMachineBase<S, AA> {
  protected action$ = new Subject<AA>()

  constructor(initial: S) {
    super(initial)

    this.action$
      .pipe(
        withLatestFrom(this.state$),
        concatMap(([a, s]) => of(this.reductor(a, s)))
      )
      .subscribe(this.state$)
  }
}

export abstract class AsyncStateMachine<
  S,
  AA extends GenericAction = GenericAction
> extends StateMachineBase<S, AA> {
  protected action$ = new TriggerSubject<AA>()

  protected waitingActionList: WaitingAction<S, AA>[] = []

  protected waitUntil = (expr: (s: S) => boolean, action: AA) => {
    this.waitingActionList.push([expr, action])
  }

  protected defer = (fn: (...args: any) => void, ...args: any) => {
    asapScheduler.schedule(() => fn.apply(this, args))
  }

  protected handleStateChange = (newState: S) => {
    for (let i = 0; i < this.waitingActionList.length; i++) {
      const [expr, action] = this.waitingActionList[i]
      if (expr(newState)) {
        this.waitingActionList.splice(i, 1)
        this.action$.putFirst(action)
        break
      }
    }
    this.state$.next(newState)
  }

  constructor(initial: S) {
    super(initial)

    this.action$
      .pipe(
        withLatestFrom(this.state$),
        concatMap(([a, s]) => of(this.reductor(a, s)))
      )
      .subscribe(this.handleStateChange)

    this.state$.subscribe(s => {
      this.action$.trigger()
    })
  }
}
