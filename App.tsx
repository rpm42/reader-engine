import * as React from 'react'
import { useEffect } from 'react'
import './style.css'
import { BehaviorSubject, Observable } from 'rxjs'
import AppProvider, { useAppContext } from './AppProvider'
import useObservable from './utils/useObservable'
import AppService from './AppService'
import ValueSubject from './utils/ValueSubject'
import useBehaviorSubject from './utils/useBehaviorSubject'
import useSubject from './utils/useSubject'
import ReactSlider from 'react-slider'
import styled from 'styled-components'

const StyledSlider = styled(ReactSlider)`
    width: 100%;
    height: 5px;
`

const StyledThumb = styled.div`
    position: relative;
    top: -7px;
    font-size: 10px;
    height: 20px;
    line-height: 20px;
    width: 20px;
    text-align: center;
    background-color: #000;
    color: #fff;
    border-radius: 50%;
    cursor: grab;
`

const Thumb = (props, state) => (
  <StyledThumb {...props}>{state.valueNow}</StyledThumb>
)

const StyledTrack = styled.div`
    top: 0;
    bottom: 0;
    background: ${props => (props.index === 1 ? '#ddd' : '#0f0')};
    border-radius: 999px;
`

const Track = (props, state) => (
  <StyledTrack {...props} index={state.index} />
)

function setCssVariable(name: string, value: string | number) {
  if (!name || !value) return
  document.documentElement.style.setProperty(
    `--${name}`,
    typeof value === 'number' ? value.toString() : value
  )
}

function useCssVariableRx(
  name: string,
  value$: ValueSubject<string | number>
) {
  const [value] = useObservable(value$, value$.value)
  useEffect(() => {
    if (!name || !value) return
    setCssVariable(name, value)
  }, [value])
}

export default function App() {
  const ctx = useAppContext()
  if (!ctx) return
  const [colorTheme, setColorTheme] = useSubject<string>(
    ctx.colorTheme$,
    ctx.colorTheme$.key
  )
  const [fontTheme, setFontTheme] = useSubject<string>(
    ctx.fontTheme$,
    ctx.fontTheme$.key
  )

  const [fontScale, setFontScale] = useBehaviorSubject(ctx.fontScale$)
  const [paddingScale, setPaddingScale] = useBehaviorSubject<number>(
    ctx.paddingScale$
  )
  const [lineHeight, setLineHeight] = useBehaviorSubject(
    ctx.lineHeight$
  )
  const [charPerRow] = useObservable<number>(ctx.charPerRow$)
  const [fontProportion] = useObservable<number>(ctx.fontProportion$)
  const [fontSizeRx] = useObservable<number>(ctx.fontSizeRx$)
  const [pageWidth] = useObservable<number>(ctx.pageWidth$)
  // console.log('App render', charPerRow)

  useCssVariableRx('background', ctx.background$)
  useCssVariableRx('textColor', ctx.textColor$)

  useCssVariableRx('bodyFamily', ctx.bodyFamily$)
  useCssVariableRx('headerFamily', ctx.headerFamily$)
  useCssVariableRx('bodyWeight', ctx.bodyWeight$)
  useCssVariableRx('boldWeight', ctx.boldWeight$)
  useCssVariableRx('headerWeight', ctx.headerWeight$)
  useCssVariableRx('bodySize', ctx.bodySizeRel$)
  // useCssVariableRx('lineHeight', ctx.lineHeight$)

  function changeColorTheme() {
    const themes = Object.keys(ctx.colorTheme$.values)
    const themeIndex = themes.indexOf(colorTheme)
    const nextTheme = themes[(themeIndex + 1) % themes.length]
    setColorTheme(nextTheme)
  }

  function changeFontTheme() {
    const themes = Object.keys(ctx.fontTheme$.values)
    const themeIndex = themes.indexOf(fontTheme)
    const nextTheme = themes[(themeIndex + 1) % themes.length]
    setFontTheme(nextTheme)
  }
  return (
    <div>
      <div
        style={{
          maxWidth: '500px',
          padding: `0 1em 1em`
        }}
      >
        <p>
          Current color theme is <strong>{colorTheme}</strong>
          <br />
          <button onClick={changeColorTheme}>Change color theme</button>
        </p>
        <p>
          Current font theme is <strong>{fontTheme}</strong>
          <br />
          <button onClick={changeFontTheme}>Change font theme</button>
        </p>
        <p>
          Font scale: <strong>{fontScale}</strong>
          <br />
          Chars per row: <strong>{charPerRow}</strong>
          <br />
          Padding scale: {paddingScale}
          <br />
          Page Width: {pageWidth}px
          <br />
          Font size rx: {fontSizeRx}vw ={' '}
          {Math.round(pageWidth * fontSizeRx) / 100}
          px
          <br />
          Line height: {lineHeight}
        </p>
        <br />
        font scale
        <br />
        <StyledSlider
          min={-50}
          max={50}
          step={5}
          defaultValue={0}
          renderTrack={Track}
          renderThumb={Thumb}
          onChange={(v: number) => setFontScale(v)}
        />
        <br />
        padding scale
        <br />
        <StyledSlider
          min={0}
          max={33}
          step={1}
          defaultValue={10}
          renderTrack={Track}
          renderThumb={Thumb}
          onChange={(v: number) => setPaddingScale(v)}
        />
        <br />
        line height
        <br />
        <StyledSlider
          min={0.9}
          max={3}
          step={0.1}
          defaultValue={1.5}
          renderTrack={Track}
          renderThumb={Thumb}
          onChange={(v: number) => setLineHeight(v)}
        />
      </div>
      <hr />
      <div
        style={{
          padding: `1em ${paddingScale}vw`,
          position: 'relative',
          // fontSize: `calc((100vw - ${
          //   paddingScale * 2
          // }vw) / (${charPerRow} / ${fontProportion}))`
          fontSize: `${fontSizeRx}vw`,
          lineHeight: lineHeight
        }}
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
          do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Nullam vehicula ipsum a arcu cursus. At tempor commodo
          ullamcorper a lacus vestibulum sed arcu. Sapien et ligula
          ullamcorper malesuada proin libero nunc consequat. Varius sit
          amet mattis vulputate enim. Semper feugiat nibh sed pulvinar
          proin. Suspendisse faucibus interdum posuere lorem ipsum.
          Tincidunt praesent semper feugiat nibh sed pulvinar proin
          gravida. Vitae nunc sed velit dignissim sodales. Feugiat
          scelerisque varius morbi enim. Quisque sagittis purus sit
          amet.
        </p>
        <p>
          Posuere sollicitudin aliquam ultrices sagittis orci. At tellus
          at urna condimentum mattis pellentesque id. Eu ultrices vitae
          auctor eu. Semper auctor neque vitae tempus. In est ante in
          nibh mauris cursus mattis molestie. Montes nascetur ridiculus
          mus mauris vitae ultricies leo integer malesuada. Turpis
          egestas sed tempus urna et pharetra pharetra. Viverra tellus
          in hac habitasse. Venenatis a condimentum vitae sapien
          pellentesque. Lobortis feugiat vivamus at augue eget arcu.
          Odio ut sem nulla pharetra. Velit scelerisque in dictum non.
          Pretium viverra suspendisse potenti nullam ac tortor vitae
          purus. Non tellus orci ac auctor augue mauris augue neque
          gravida. Porttitor rhoncus dolor purus non enim praesent.
          Ultrices vitae auctor eu augue ut. Augue mauris augue neque
          gravida in fermentum et sollicitudin. Vitae congue eu
          consequat ac. Volutpat sed cras ornare arcu dui vivamus arcu.
        </p>
        <p>
          Et ligula ullamcorper malesuada proin libero. Nam aliquam sem
          et tortor. Purus sit amet volutpat consequat mauris nunc.
          Ipsum faucibus vitae aliquet nec ullamcorper. Urna duis
          convallis convallis tellus id interdum. Fermentum odio eu
          feugiat pretium nibh. Est sit amet facilisis magna etiam.
          Molestie a iaculis at erat pellentesque adipiscing commodo.
          Pellentesque eu tincidunt tortor aliquam. Posuere ac ut
          consequat semper.
        </p>
      </div>
    </div>
  )
}
