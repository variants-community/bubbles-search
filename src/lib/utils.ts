export const cl = (...args: (string | false | undefined | null | Record<string, unknown>)[]) => {
  let classlist = ''
  for (const arg of args) {
    if (!arg) continue
    if (typeof arg === 'string') classlist += classlist ? ' ' + arg : arg
    else if (typeof arg === 'object') {
      for (const key in arg) {
        if ({}.hasOwnProperty.call(arg, key) && arg[key]) {
          classlist += classlist ? ' ' + key : key
        }
      }
    }
  }
  return classlist
}

export const createRange = (node: Node, targetPosition: number) => {
  const range = document.createRange()
  range.selectNode(node)

  const stack = [node]
  let current
  let pos = 0
  while ((current = stack.pop())) {
    if (current.nodeType === Node.TEXT_NODE) {
      const len = current.textContent!.length
      if (pos + len >= targetPosition) {
        range.setStart(current, targetPosition - pos)
        range.collapse(true)
        return range
      }
      pos += len
    } else {
      for (let i = current.childNodes.length - 1; i >= 0; i--) stack.push(current.childNodes[i])
    }
  }
  range.setStart(node, node.childNodes.length)
  range.collapse(true)
  return range
}

export const setSelectionPosition = (selection: Selection, el: Node, targetPosition: number) => {
  const range = createRange(el, targetPosition)
  selection.removeAllRanges()
  selection.addRange(range)
}

export const getSelectionPosition = (selection: Selection, el: Node) => {
  const range = selection.getRangeAt(0)
  const preSelectionRange = range.cloneRange()
  preSelectionRange.selectNodeContents(el)
  preSelectionRange.setEnd(range.endContainer, range.endOffset)
  return preSelectionRange.toString().length
}
