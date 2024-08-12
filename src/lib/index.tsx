import { ReadonlySignal, useComputed, useSignal } from '@preact/signals'
import { JSX, RefObject, render } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { getSelectionPosition, setSelectionPosition } from './utils'

export type HintComponentProps<T> = { value: ReadonlySignal<string>; onSelect: (value: T) => void }

type CustomHint<T> = {
  type: 'custom'
  component: (props: HintComponentProps<T>) => JSX.Element
}

type ListHint<T extends Record<string, unknown>> = {
  type: 'list'
  item: (props: T) => JSX.Element
  getOptions: (partialValue: string) => T[]
}

type Hint<T> =
  (T extends Record<string, unknown>
    ? ListHint<T> | CustomHint<T>
    : unknown extends T
    ? ListHint<{}> | CustomHint<T>
    : CustomHint<T>) & {
      format: (value: T) => string
      deserialize: (value: string) => T
    }

const List = <T extends Record<string, unknown>>(props: {
  item: (props: T) => JSX.Element
  options: ReadonlySignal<T[]>
  onSelect: (val: T) => void
}) => {
  const current = useSignal<number>(0)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        current.value = current.value > 0 ? current.value - 1 : 0
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        current.value = current.value < props.options.value.length - 1 ? current.value + 1 : current.value
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault()
        props.onSelect(props.options.value[current.value])
      }
    }

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const ref = useRef<HTMLDivElement>(null)

  const scrollToIndexHack = (index: number) => {
    if (!ref.current) return

    const top = (ref.current.children[index]as any).offsetTop
    ref.current.scrollTo({top, behavior: 'smooth'})
    // ref.current?.children[index].scrollIntoView({behavior: 'smooth', block: 'nearest'})
    return 'bubble-search__hintbox__list__item--active'
  }

  return (
    <div ref={ref} class='bubble-search__hintbox__list'>
      {props.options.value.map((option, i) => (
        <div onMouseOver={() => current.value = i} class={`bubble-search__hintbox__list__item ${i === current.value ? scrollToIndexHack(i) : ''}`} onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          e.stopImmediatePropagation()
          props.onSelect(option)
        }}><props.item {...option} /></div>
      ))}
    </div>
  )
}

export const BubblesSearch = <T extends Record<string, unknown>>(props: {
  hints: { [K in keyof T]: Hint<T[K]> }
  onInput: (values: { [K in keyof T]: T[K][] } & { rowText: string }) => void
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const hintPosition = useSignal<{ x: number; y: number }>()

  const currentHintName = useSignal<keyof T>()
  const currentHintValue = useSignal<string>('')
  const currentAnchor = useRef<HTMLElement>(null)

  const currentHint = useComputed(() =>
    currentHintName.value ? (props.hints[currentHintName.value] as Hint<unknown>) : undefined
  )

  useEffect(() => void ref.current?.dispatchEvent(new Event('input')), [])

  const onInput = (e: JSX.TargetedInputEvent<HTMLDivElement>) => {
    let values: Record<string, any[] | any> = {}

    let html = e.currentTarget.innerText
      .replace(/(^|\s)([^\s]+):([^\s]*)/g, (_, p, k, v) => {
        if (!Object.keys(props.hints).includes(k)) {

          return _.replace(
            /^(\s*)([^\s]+)(\s*)$/,
            (_, s, m, e) =>
              `${' '.repeat(s.length)}<span class="bubble-search__textbox__bubble--invalid" data-error="Unknown property '${k}'">${m}</span>${' '.repeat(e.length)}`
          )
        }

        const itemValue = props.hints[k].deserialize(v)
        if (itemValue) {
          if (k in values) {
            values[k].push(v)
          } else {
            values[k] = [v]
          }
        }

        return `<span class="bubble-search__textbox__bubble-space">${p}</span><span class="bubble-search__textbox__bubble"><span class="bubble-search__textbox__bubble__key">${k}<span class="bubble-search__textbox__bubble-colon">:</span></span><span class="bubble-search__textbox__bubble__value">${v}</span></span>`
      })
      .replace(/\u00A0([^\s<>])/g, ' $1')
      .replace(/(<\/span>)\s*$/, '$1\u00A0')

    const selection = document.getSelection()!

    const position = selection.rangeCount && getSelectionPosition(selection, e.currentTarget)
    e.currentTarget.innerHTML = html
    selection.rangeCount && setSelectionPosition(selection, e.currentTarget, position)

    const anchorNode = selection.anchorNode?.parentElement
    let bubble = undefined

    if (anchorNode) {
      currentAnchor.current = anchorNode
      if (anchorNode.className === 'bubble-search__textbox__bubble-colon') {
        currentHintName.value = anchorNode.parentElement!.childNodes[0].textContent!

        currentHintValue.value = ''
        bubble = anchorNode.parentElement!.parentElement
      } else if (anchorNode.className === 'bubble-search__textbox__bubble__value') {
        currentHintName.value = anchorNode.parentElement!.childNodes[0].childNodes[0].textContent!
        currentHintValue.value = anchorNode.textContent!
        bubble = anchorNode.parentElement
      } else {
        currentHintName.value = undefined
        currentHintValue.value = ''
      }
    }

    if (bubble && ref.current) {
      const bubbleRect = bubble.getBoundingClientRect()
      const searchRect = ref.current.getBoundingClientRect()

      const x = bubbleRect.x - searchRect.x
      const y = bubbleRect.y - searchRect.y

      hintPosition.value = { x, y }
    } else {
      hintPosition.value = undefined
    }

    values['rowText'] = html.replace(/<[^>]*>/g, "")

    // @ts-ignore
    props.onInput(values)
  }



  return (
    <div class='bubble-search'>
      <div ref={ref} class='bubble-search__textbox' contenteditable spellcheck={false} onInput={onInput}>
      </div>
      <Hint textboxRef={ref} anchor={currentAnchor} position={hintPosition} hint={currentHint} closeHint={() => currentHintName.value = undefined} partialValue={currentHintValue} />
    </div>
  )
}

const Hint = <T extends unknown>(props: {
  position: ReadonlySignal<{ x: number; y: number } | undefined>
  hint: ReadonlySignal<Hint<T> | undefined>
  closeHint: () => void
  partialValue: ReadonlySignal<string>
  anchor: RefObject<HTMLElement>
  textboxRef: RefObject<HTMLElement>
}) => {
  if (!props.hint.value) return null

  const options = useComputed(() => {
    if (!props.hint.value || props.hint.value.type === 'custom') return []
    return props.hint.value.getOptions(props.partialValue.value)
  })

  const style = useComputed(
    () => props.position.value && `transform: translate(${props.position.value.x}px, 10px)`// `transform: translate(${props.position.value.x}px, ${props.position.value.y}px)`
  )
  return (
    <div class='bubble-search__hintbox' style={style}>
      {props.hint.value.type === 'custom' ? (
        <props.hint.value.component
          value={props.partialValue}
          onSelect={selectedValueObject => {
            if (props.hint.value && props.hint.value.type === 'custom') {         
              replaceWithHint({
                currentBubbleAnchor: props.anchor,
                textInputAnchor: props.textboxRef,
                rowValue: props.hint.value.format(selectedValueObject as any)
              })
              props.closeHint()
            }
          }}
        />
      ) : (
        <List item={props.hint.value.item} options={options} onSelect={selectedValueObject => {
          if (props.hint.value && props.hint.value.type === 'list') {
            replaceWithHint({
              currentBubbleAnchor: props.anchor,
              textInputAnchor: props.textboxRef,
              rowValue: props.hint.value.format(selectedValueObject as any)
            })
          }
          props.closeHint()
        }} />
      )}
    </div>
  )
}

const replaceWithHint = ({ currentBubbleAnchor, textInputAnchor, rowValue }: {
  rowValue: string,
  currentBubbleAnchor: RefObject<HTMLElement>
  textInputAnchor: RefObject<HTMLElement>

}) => {
  if (currentBubbleAnchor.current) {
    let valueSpan = undefined

    if (currentBubbleAnchor.current.classList.contains('bubble-search__textbox__bubble__value')) {
      valueSpan = currentBubbleAnchor.current
    } else if (currentBubbleAnchor.current.classList.contains('bubble-search__textbox__bubble-colon')) {
      valueSpan = currentBubbleAnchor.current.parentElement?.nextElementSibling
    }

    if (!valueSpan) return

    const selection = document.getSelection()!
    const position = selection.rangeCount && getSelectionPosition(selection, textInputAnchor.current!)
    const startLength = valueSpan.innerHTML.length
    valueSpan.innerHTML = rowValue
    selection.rangeCount && setSelectionPosition(selection, textInputAnchor.current!, position + rowValue.length - startLength + 1)

    const eventTrigger = new Event('input')
    textInputAnchor.current?.dispatchEvent(eventTrigger)

  }
}

BubblesSearch.mount = <T extends Record<string, unknown>>(
  selector: string,
  props: {
    hints: { [K in keyof T]: Hint<T[K]> }
    onInput: (values: { [K in keyof T]: T[K][] } & { rowText: string }) => void
  }
) => render(<BubblesSearch {...props} />, document.querySelector(selector)!)
