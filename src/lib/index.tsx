import { JSX, render } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { getSelectionPosition, setSelectionPosition } from './utils'

type Props = {
  keys: string[]
}

export const BubblesSearch = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => void ref.current?.dispatchEvent(new Event('input')), [])

  const onInput = (e: JSX.TargetedInputEvent<HTMLDivElement>) => {
    let html = e.currentTarget.innerText
      .replace(/(^|\s)([^\s]+):([^\s]*)/g, (_, p, k, v) => {
        if (!props.keys.includes(k))
          return _.replace(
            /^(\s*)([^\s]+)(\s*)$/,
            (_, s, m, e) =>
              `${' '.repeat(s.length)}<span class="bubble-invalid" data-error="Unknown property '${k}'">${m}</span>${' '.repeat(e.length)}`
          )
        return `<span class="bubble-space">${p}</span><span class="bubble"><span class="bubble-key">${k}<span class="bubble-colon">:</span></span><span class="bubble-value">${v}</span></span>`
      })
      .replace(/\u00A0([^\s<>])/g, ' $1')
      .replace(/(<\/span>)\s*$/, '$1\u00A0')

    const selection = document.getSelection()!
    const position = selection.rangeCount && getSelectionPosition(selection, e.currentTarget)
    e.currentTarget.innerHTML = html
    selection.rangeCount && setSelectionPosition(selection, e.currentTarget, position)
  }

  return (
    <div ref={ref} class='bubble-searchbox' contenteditable spellcheck={false} onInput={onInput}>
      Hello! My name:Artur is known, and I am here to action:play for typee:fun. Would you like to join:me, Mr.
      name:unknown ?
    </div>
  )
}

BubblesSearch.mount = (selector: string, props: Props) =>
  render(<BubblesSearch {...props} />, document.querySelector(selector)!)
