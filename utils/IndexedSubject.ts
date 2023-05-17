import { filter, map, Subject, tap } from 'rxjs'

export class IndexedSubject<T> extends Subject<number> {
  private _input$ = new Subject<number>()
  public value$ = new Subject<T>()
  public value?: T

  next = this._input$.next

  constructor(public index: number, public values: T[]) {
    super()
    this._input$
      .pipe(filter(index => index >= 0 && index < this.values.length))
      .subscribe(v => super.next(v))
    this.pipe(
      tap(v => (this.index = v)),
      map(index => this.values[index]),
      tap(v => (this.value = v))
    ).subscribe(this.value$)
    this._input$.next(index)
  }
}

export default IndexedSubject
