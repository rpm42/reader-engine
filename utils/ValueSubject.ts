import { Observable, Subject, tap } from 'rxjs'

export class ValueSubject<T> extends Subject<T> {
  value?: T
  constructor() {
    super()
    this.subscribe(v => (this.value = v))
  }
}

export class ValueObservable<T> extends Subject<T> {
  value?: T
  constructor(public value$: Observable<T>) {
    super()
    value$.pipe(tap(v => (this.value = v))).subscribe(this)
  }
}

export default ValueSubject
