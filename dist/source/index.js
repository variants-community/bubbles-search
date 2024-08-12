import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useComputed, useSignal } from '@preact/signals';
import { render } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { getSelectionPosition, setSelectionPosition } from './utils';
const List = (props) => {
    const current = useSignal(0);
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                current.value = current.value > 0 ? current.value - 1 : 0;
            }
            else if (e.key === 'ArrowDown') {
                e.preventDefault();
                current.value = current.value < props.options.value.length - 1 ? current.value + 1 : current.value;
            }
            else if (e.key === 'Tab' || e.key === 'Enter') {
                e.preventDefault();
                props.onSelect(props.options.value[current.value]);
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);
    const ref = useRef(null);
    const scrollToIndexHack = (index) => {
        ref.current?.children[index].scrollIntoView({ behavior: 'smooth' });
        return 'bubble-search__hintbox__list__item--active';
    };
    return (_jsx("div", { ref: ref, class: 'bubble-search__hintbox__list', children: props.options.value.map((option, i) => (_jsx("div", { onMouseOver: () => current.value = i, class: `bubble-search__hintbox__list__item ${i === current.value ? scrollToIndexHack(i) : ''}`, onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                props.onSelect(option);
            }, children: _jsx(props.item, { ...option }) }))) }));
};
export const BubblesSearch = (props) => {
    const ref = useRef(null);
    const hintPosition = useSignal();
    const currentHintName = useSignal();
    const currentHintValue = useSignal('');
    const currentAnchor = useRef(null);
    const currentHint = useComputed(() => currentHintName.value ? props.hints[currentHintName.value] : undefined);
    useEffect(() => void ref.current?.dispatchEvent(new Event('input')), []);
    const onInput = (e) => {
        let values = {};
        let html = e.currentTarget.innerText
            .replace(/(^|\s)([^\s]+):([^\s]*)/g, (_, p, k, v) => {
            if (!Object.keys(props.hints).includes(k)) {
                return _.replace(/^(\s*)([^\s]+)(\s*)$/, (_, s, m, e) => `${' '.repeat(s.length)}<span class="bubble-search__textbox__bubble--invalid" data-error="Unknown property '${k}'">${m}</span>${' '.repeat(e.length)}`);
            }
            const itemValue = props.hints[k].deserialize(v);
            if (itemValue) {
                if (k in values) {
                    values[k].push(v);
                }
                else {
                    values[k] = [v];
                }
            }
            return `<span class="bubble-search__textbox__bubble-space">${p}</span><span class="bubble-search__textbox__bubble"><span class="bubble-search__textbox__bubble__key">${k}<span class="bubble-search__textbox__bubble-colon">:</span></span><span class="bubble-search__textbox__bubble__value">${v}</span></span>`;
        })
            .replace(/\u00A0([^\s<>])/g, ' $1')
            .replace(/(<\/span>)\s*$/, '$1\u00A0');
        const selection = document.getSelection();
        const position = selection.rangeCount && getSelectionPosition(selection, e.currentTarget);
        e.currentTarget.innerHTML = html;
        selection.rangeCount && setSelectionPosition(selection, e.currentTarget, position);
        const anchorNode = selection.anchorNode?.parentElement;
        let bubble = undefined;
        if (anchorNode) {
            currentAnchor.current = anchorNode;
            if (anchorNode.className === 'bubble-search__textbox__bubble-colon') {
                currentHintName.value = anchorNode.parentElement.childNodes[0].textContent;
                currentHintValue.value = '';
                bubble = anchorNode.parentElement.parentElement;
            }
            else if (anchorNode.className === 'bubble-search__textbox__bubble__value') {
                currentHintName.value = anchorNode.parentElement.childNodes[0].childNodes[0].textContent;
                currentHintValue.value = anchorNode.textContent;
                bubble = anchorNode.parentElement;
            }
            else {
                currentHintName.value = undefined;
                currentHintValue.value = '';
            }
        }
        if (bubble && ref.current) {
            const bubbleRect = bubble.getBoundingClientRect();
            const searchRect = ref.current.getBoundingClientRect();
            const x = bubbleRect.x - searchRect.x;
            const y = bubbleRect.y - searchRect.y;
            hintPosition.value = { x, y };
        }
        else {
            hintPosition.value = undefined;
        }
        values['rowText'] = html.replace(/<[^>]*>/g, "");
        // @ts-ignore
        props.onInput(values);
    };
    return (_jsxs("div", { class: 'bubble-search', children: [_jsx("div", { ref: ref, class: 'bubble-search__textbox', contenteditable: true, spellcheck: false, onInput: onInput }), _jsx(Hint, { textboxRef: ref, anchor: currentAnchor, position: hintPosition, hint: currentHint, closeHint: () => currentHintName.value = undefined, partialValue: currentHintValue })] }));
};
const Hint = (props) => {
    if (!props.hint.value)
        return null;
    const options = useComputed(() => {
        if (!props.hint.value || props.hint.value.type === 'custom')
            return [];
        return props.hint.value.getOptions(props.partialValue.value);
    });
    const style = useComputed(() => props.position.value && `transform: translate(${props.position.value.x}px, 10px)` // `transform: translate(${props.position.value.x}px, ${props.position.value.y}px)`
    );
    return (_jsx("div", { class: 'bubble-search__hintbox', style: style, children: props.hint.value.type === 'custom' ? (_jsx(props.hint.value.component, { value: props.partialValue, onSelect: selectedValueObject => {
                if (props.hint.value && props.hint.value.type === 'custom') {
                    replaceWithHint({
                        currentBubbleAnchor: props.anchor,
                        textInputAnchor: props.textboxRef,
                        rowValue: props.hint.value.format(selectedValueObject)
                    });
                    props.closeHint();
                }
            } })) : (_jsx(List, { item: props.hint.value.item, options: options, onSelect: selectedValueObject => {
                if (props.hint.value && props.hint.value.type === 'list') {
                    replaceWithHint({
                        currentBubbleAnchor: props.anchor,
                        textInputAnchor: props.textboxRef,
                        rowValue: props.hint.value.format(selectedValueObject)
                    });
                }
                props.closeHint();
            } })) }));
};
const replaceWithHint = ({ currentBubbleAnchor, textInputAnchor, rowValue }) => {
    if (currentBubbleAnchor.current) {
        let valueSpan = undefined;
        if (currentBubbleAnchor.current.classList.contains('bubble-search__textbox__bubble__value')) {
            valueSpan = currentBubbleAnchor.current;
        }
        else if (currentBubbleAnchor.current.classList.contains('bubble-search__textbox__bubble-colon')) {
            valueSpan = currentBubbleAnchor.current.parentElement?.nextElementSibling;
        }
        if (!valueSpan)
            return;
        const selection = document.getSelection();
        const position = selection.rangeCount && getSelectionPosition(selection, textInputAnchor.current);
        const startLength = valueSpan.innerHTML.length;
        valueSpan.innerHTML = rowValue;
        selection.rangeCount && setSelectionPosition(selection, textInputAnchor.current, position + rowValue.length - startLength + 1);
        const eventTrigger = new Event('input');
        textInputAnchor.current?.dispatchEvent(eventTrigger);
    }
};
BubblesSearch.mount = (selector, props) => render(_jsx(BubblesSearch, { ...props }), document.querySelector(selector));
