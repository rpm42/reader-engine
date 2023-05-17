import { BehaviorSubject, filter, Subject } from 'rxjs'

export class RangeSubject extends BehaviorSubject<number> {
  private _input$ = new Subject<number>()
  next(v: number) {
    this._input$.next(v)
  }
  inc = () => this.next(this.value + this.step)
  dec = () => this.next(this.value + this.step)

  constructor(
    value: number,
    public min: number,
    public max: number,
    public step: number = 1
  ) {
    super(value)
    this._input$
      .pipe(filter(v => v >= this.min && v <= this.max))
      .subscribe(v => super.next(v))
  }
}

export default RangeSubject
