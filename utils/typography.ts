export interface ITypographyConfig {
  baseFontSize?: number
  baseLineHeight?: number
  scaleRatio?: number
  multiplicity?: number
  roundToNearestHalfLine?: boolean
  minLinePadding?: number
  outputRel?: boolean
}

export function roundToMultiplicity(num: number, mul: number): number {
  return num + (num % mul)
}

export function modularScale(value: number, base: number, ratio: number) {
  return base * ratio ** value
}

export function floatToMinimalSting(f: number, fractionDigits: number = 4): string {
  const s1 = f.toString()
  const s2 = f.toFixed(fractionDigits)
  return s1.length < s2.length ? s1 : s2
}

export const genericFontFamilies = [
  'inherit',
  'default',
  'serif',
  'sans-serif',
  'monospace',
  'fantasy',
  'cursive',
  '-apple-system'
]

export function wrapFontFamily(fontFamily: string) {
  return genericFontFamilies.indexOf(fontFamily) !== -1 ? fontFamily : `'${fontFamily}'`
}

export class TypographyScale {
  readonly baseFontSize: number = 16
  readonly baseLineHeight: number = 1.5
  readonly scaleRatio: number = 2
  readonly multiplicity: number = 4
  readonly roundToNearestHalfLine: boolean = true
  readonly minLinePadding: number = 2

  constructor(cfg: ITypographyConfig = {}) {
    this.baseFontSize = cfg.baseFontSize || this.baseFontSize
    this.baseLineHeight = cfg.baseLineHeight || this.baseFontSize
    this.scaleRatio = cfg.scaleRatio || this.scaleRatio
    this.multiplicity = cfg.multiplicity || this.multiplicity
    this.roundToNearestHalfLine = cfg.roundToNearestHalfLine || this.roundToNearestHalfLine
    this.minLinePadding = cfg.minLinePadding || this.minLinePadding
  }

  public get lineHeightAbs() {
    return roundToMultiplicity(this.baseFontSize * this.baseLineHeight, this.multiplicity)
  }

  public get lineHeightRel() {
    return this.lineHeightAbs / this.baseFontSize
  }

  public rel(sizeAbs: number): number {
    return sizeAbs / this.baseFontSize
  }

  public getLinesHeightAbs(lines: number): number {
    if (!lines) lines = 1
    return lines * this.lineHeightAbs
  }

  public getLinesHeightRel(lines: number): number {
    return this.rel(this.getLinesHeightAbs(lines))
  }

  public scaleAbs(value: number): number {
    const fontSize = modularScale(value, this.baseFontSize, this.scaleRatio)
    return fontSize
  }

  public scaleRel(value: number): number {
    return this.rel(this.scaleAbs(value))
  }

  public lineHeightForFontAbs(fontSizeAbs: number): number {
    const lines = this._linesForFontSize(fontSizeAbs, this.lineHeightAbs)
    return this.getLinesHeightAbs(lines)
  }

  public lineHeightForFontRel(fontSizeRel: number): number {
    const lines = this._linesForFontSize(fontSizeRel * this.baseFontSize, this.lineHeightAbs)
    return this.getLinesHeightRel(lines)
  }

  protected _linesForFontSize(fontSizeAbs: number, lineHeightAbs: number) {
    const { roundToNearestHalfLine, minLinePadding } = this
    let lines = roundToNearestHalfLine
      ? Math.ceil((2 * fontSizeAbs) / lineHeightAbs) / 2
      : Math.ceil(fontSizeAbs / lineHeightAbs)

    if (lines * lineHeightAbs - fontSizeAbs < minLinePadding * 2) {
      lines += roundToNearestHalfLine ? 0.5 : 1
    }

    return lines
  }
}
