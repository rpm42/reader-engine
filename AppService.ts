import {
  BehaviorSubject,
  combineLatest,
  fromEvent,
  Observable
} from 'rxjs'
import {
  tap,
  auditTime,
  map,
  distinctUntilChanged,
  withLatestFrom
} from 'rxjs/operators'
import { COLOR_THEMES, FontTheme, FONT_THEMES } from './variables'
import type { ColorTheme } from './variables'
import KeySubject from './utils/KeySubject'
import { ValueObservable } from './utils/ValueSubject'
import RangeSubject from './utils/RangeSubject'
import isBrowser from './utils/is-browser'

export default class AppService {
  pageWidth$ = new BehaviorSubject<number>(
    isBrowser() ? window.innerWidth : 500
  )

  colorTheme$ = new KeySubject<ColorTheme>('light', COLOR_THEMES)
  background$ = new ValueObservable<string>(
    this.colorTheme$.value$.pipe(map(v => v.background))
  )
  textColor$ = new ValueObservable<string>(
    this.colorTheme$.value$.pipe(map(v => v.textColor))
  )

  fontTheme$ = new KeySubject<FontTheme>('roboto', FONT_THEMES)
  bodyFamily$ = new ValueObservable<string>(
    this.fontTheme$.value$.pipe(map(v => v.bodyFamily))
  )
  headerFamily$ = new ValueObservable<string>(
    this.fontTheme$.value$.pipe(map(v => v.headerFamily))
  )
  bodyWeight$ = new ValueObservable<number>(
    this.fontTheme$.value$.pipe(map(v => v.bodyWeight))
  )
  boldWeight$ = new ValueObservable<number>(
    this.fontTheme$.value$.pipe(map(v => v.boldWeight))
  )
  headerWeight$ = new ValueObservable<number>(
    this.fontTheme$.value$.pipe(map(v => v.headerWeight))
  )
  bodySize$ = new ValueObservable<number>(
    this.fontTheme$.value$.pipe(map(v => v.bodySize))
  )

  fontProportion$ = new ValueObservable<number>(
    this.fontTheme$.value$.pipe(map(v => v.fontProportion))
  )

  bodySizeRel$ = new ValueObservable<string>(
    this.bodySize$.pipe(map(v => `${(v / 16) * 100}%`))
  )

  lineHeight$ = new RangeSubject(1.5, 0.9, 3, 0.1)

  fontScale$ = new RangeSubject(0, -50, 50, 5)
  charPerRow$ = new ValueObservable<number>(
    combineLatest([this.pageWidth$, this.fontScale$]).pipe(
      distinctUntilChanged(),
      map(([w, s]) => {
        const cw = w < 400 ? 40 : w < 600 ? Math.round(w / 10) : 60
        const cs = Math.round(cw + (s / 100) * cw)
        return cs
      })
    )
  )

  paddingScale$ = new RangeSubject(10, 0, 33, 1)
  fontSizeRx$ = new ValueObservable<number>(
    combineLatest([
      this.charPerRow$,
      this.paddingScale$,
      this.fontProportion$
    ]).pipe(
      distinctUntilChanged(),
      map(([c, s, p]) => {
        return Math.round(((100 - s * 2) / (c / p)) * 100) / 100
      })
    )
  )

  private _constructor() {
    console.log('_constructor')
    fromEvent(window, 'resize')
      .pipe(
        auditTime(100),
        map(ev => (ev.target as Window).innerWidth),
        distinctUntilChanged(),
        tap(console.log)
      )
      .subscribe(this.pageWidth$)
  }

  public init() {
    if (!isBrowser()) return
    console.log('init')
    this.pageWidth$.next(window.innerWidth)
    console.log(
      'app context init',
      window.innerWidth,
      this.pageWidth$.value
    )
  }

  constructor() {
    if (!isBrowser()) return
    this._constructor()
    this.colorTheme$.next('green')
    this.fontTheme$.next('noto')
  }
}
