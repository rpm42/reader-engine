import { filter, map, Subject, tap } from 'rxjs'

export class KeySubject<T> extends Subject<string> {
  private _input$ = new Subject<string>()
  private _keys: Set<string>
  public value$ = new Subject<T>()
  public value?: T

  next = this._input$.next

  constructor(public key: string, public values: { [key: string]: T }) {
    super()
    this._keys = new Set(Object.keys(values))
    this._input$
      .pipe(filter(key => this._keys.has(key)))
      .subscribe(v => super.next(v))
    this.pipe(
      tap(key => (this.key = key)),
      map(key => this.values[key]),
      tap(v => (this.value = v))
    ).subscribe(this.value$)
    this._input$.next(key)
  }
}

export default KeySubject
