import { options as y, render as k } from "preact";
import { useSignal as m, useComputed as x } from "@preact/signals";
import { useRef as E, useEffect as C } from "preact/hooks";
var D = 0;
function i(e, t, l, n, a, r) {
  t || (t = {});
  var o, c, u = t;
  if ("ref" in u) for (c in u = {}, t) c == "ref" ? o = t[c] : u[c] = t[c];
  var _ = { type: e, props: u, key: l, ref: o, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --D, __i: -1, __u: 0, __source: a, __self: r };
  if (typeof e == "function" && (o = e.defaultProps)) for (c in o) u[c] === void 0 && (u[c] = o[c]);
  return y.vnode && y.vnode(_), _;
}
const V = (e, t) => {
  const l = document.createRange();
  l.selectNode(e);
  const n = [e];
  let a, r = 0;
  for (; a = n.pop(); )
    if (a.nodeType === Node.TEXT_NODE) {
      const o = a.textContent.length;
      if (r + o >= t)
        return l.setStart(a, t - r), l.collapse(!0), l;
      r += o;
    } else
      for (let o = a.childNodes.length - 1; o >= 0; o--) n.push(a.childNodes[o]);
  return l.setStart(e, e.childNodes.length), l.collapse(!0), l;
}, R = (e, t, l) => {
  const n = V(t, l);
  e.removeAllRanges(), e.addRange(n);
}, T = (e, t) => {
  const l = e.getRangeAt(0), n = l.cloneRange();
  return n.selectNodeContents(t), n.setEnd(l.endContainer, l.endOffset), n.toString().length;
}, A = (e) => {
  const t = m(0);
  return C(() => {
    const l = (n) => {
      n.key === "ArrowUp" ? (n.preventDefault(), console.log("up ", t.value), t.value = t.value > 0 ? t.value - 1 : 0) : n.key === "ArrowDown" ? (n.preventDefault(), console.log("down ", t.value), t.value = t.value < e.options.value.length - 1 ? t.value + 1 : t.value) : (n.key === "Tab" || n.key === "Enter") && (n.preventDefault(), e.onSelect(e.options.value[t.value]));
    };
    return document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l);
  }, []), /* @__PURE__ */ i("div", { class: "bubble-search__hintbox__list", children: e.options.value.map((l, n) => /* @__PURE__ */ i("div", { onMouseOver: () => t.value = n, class: `bubble-search__hintbox__list__item ${n === t.value ? "bubble-search__hintbox__list__item--active" : ""}`, onClick: (a) => {
    a.preventDefault(), a.stopPropagation(), a.stopImmediatePropagation(), e.onSelect(l);
  }, children: /* @__PURE__ */ i(e.item, { ...l }) })) });
}, S = (e) => {
  const t = E(null), l = m(), n = m(), a = m(""), r = E(null), o = x(
    () => n.value ? e.hints[n.value] : void 0
  );
  return C(() => void t.current?.dispatchEvent(new Event("input")), []), /* @__PURE__ */ i("div", { class: "bubble-search", children: [
    /* @__PURE__ */ i("div", { ref: t, class: "bubble-search__textbox", contenteditable: !0, spellcheck: !1, onInput: (u) => {
      let _ = {}, p = u.currentTarget.innerText.replace(/(^|\s)([^\s]+):([^\s]*)/g, (f, g, s, v) => Object.keys(e.hints).includes(s) ? (console.log("k: ", s), console.log("v: ", v), e.hints[s].deserialize(v) && (s in _ ? _[s].push(v) : _[s] = [v]), `<span class="bubble-search__textbox__bubble-space">${g}</span><span class="bubble-search__textbox__bubble"><span class="bubble-search__textbox__bubble__key">${s}<span class="bubble-search__textbox__bubble-colon">:</span></span><span class="bubble-search__textbox__bubble__value">${v}</span></span>`) : f.replace(
        /^(\s*)([^\s]+)(\s*)$/,
        (P, w, H, L) => `${" ".repeat(w.length)}<span class="bubble-search__textbox__bubble--invalid" data-error="Unknown property '${s}'">${H}</span>${" ".repeat(L.length)}`
      )).replace(/\u00A0([^\s<>])/g, " $1").replace(/(<\/span>)\s*$/, "$1 ");
      const h = document.getSelection(), $ = h.rangeCount && T(h, u.currentTarget);
      u.currentTarget.innerHTML = p, h.rangeCount && R(h, u.currentTarget, $);
      const b = h.anchorNode?.parentElement;
      let d;
      if (b && (r.current = b, b.className === "bubble-search__textbox__bubble-colon" ? (n.value = b.parentElement.childNodes[0].textContent, a.value = "", d = b.parentElement.parentElement) : b.className === "bubble-search__textbox__bubble__value" ? (n.value = b.parentElement.childNodes[0].childNodes[0].textContent, a.value = b.textContent, d = b.parentElement) : (n.value = void 0, a.value = "")), d && t.current) {
        const f = d.getBoundingClientRect(), g = t.current.getBoundingClientRect(), s = f.x - g.x, v = f.y - g.y;
        l.value = { x: s, y: v };
      } else
        l.value = void 0;
      _.rowText = p.replace(/<[^>]*>/g, ""), e.onInput(_);
    }, children: "Hello! My name:Artur" }),
    /* @__PURE__ */ i(M, { textboxRef: t, anchor: r, position: l, hint: o, closeHint: () => n.value = void 0, partialValue: a })
  ] });
}, M = (e) => {
  if (!e.hint.value) return null;
  const t = x(() => !e.hint.value || e.hint.value.type === "custom" ? [] : e.hint.value.getOptions(e.partialValue.value)), l = x(
    () => e.position.value && `transform: translate(${e.position.value.x}px, 10px)`
    // `transform: translate(${props.position.value.x}px, ${props.position.value.y}px)`
  );
  return /* @__PURE__ */ i("div", { class: "bubble-search__hintbox", style: l, children: e.hint.value.type === "custom" ? /* @__PURE__ */ i(
    e.hint.value.component,
    {
      value: e.partialValue,
      onSelect: (n) => {
        e.hint.value && e.hint.value.type === "custom" && (console.log("ON SELECT"), N({
          currentBubbleAnchor: e.anchor,
          textInputAnchor: e.textboxRef,
          rowValue: e.hint.value.format(n)
        }), e.closeHint());
      }
    }
  ) : /* @__PURE__ */ i(A, { item: e.hint.value.item, options: t, onSelect: (n) => {
    e.hint.value && e.hint.value.type === "list" && N({
      currentBubbleAnchor: e.anchor,
      textInputAnchor: e.textboxRef,
      rowValue: e.hint.value.format(n)
    }), e.closeHint(), console.log("anchor: ", e.anchor), console.log("selected: ", n);
  } }) });
}, N = ({ currentBubbleAnchor: e, textInputAnchor: t, rowValue: l }) => {
  if (e.current) {
    let n;
    if (e.current.classList.contains("bubble-search__textbox__bubble__value") ? n = e.current : e.current.classList.contains("bubble-search__textbox__bubble-colon") && (n = e.current.parentElement?.nextElementSibling), !n) return;
    const a = document.getSelection(), r = a.rangeCount && T(a, t.current), o = n.innerHTML.length;
    n.innerHTML = l, a.rangeCount && R(a, t.current, r + l.length - o + 1);
    const c = new Event("input");
    t.current?.dispatchEvent(c);
  }
};
S.mount = (e, t) => k(/* @__PURE__ */ i(S, { ...t }), document.querySelector(e));
export {
  S as BubblesSearch
};
//# sourceMappingURL=index.js.map
