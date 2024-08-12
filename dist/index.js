import { options as E, render as L } from "preact";
import { useSignal as g, useComputed as m } from "@preact/signals";
import { useRef as p, useEffect as R } from "preact/hooks";
var V = 0;
function s(e, t, l, n, a, o) {
  t || (t = {});
  var c, r, u = t;
  if ("ref" in u) for (r in u = {}, t) r == "ref" ? c = t[r] : u[r] = t[r];
  var _ = { type: e, props: u, key: l, ref: c, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --V, __i: -1, __u: 0, __source: a, __self: o };
  if (typeof e == "function" && (c = e.defaultProps)) for (r in c) u[r] === void 0 && (u[r] = c[r]);
  return E.vnode && E.vnode(_), _;
}
const D = (e, t) => {
  const l = document.createRange();
  l.selectNode(e);
  const n = [e];
  let a, o = 0;
  for (; a = n.pop(); )
    if (a.nodeType === Node.TEXT_NODE) {
      const c = a.textContent.length;
      if (o + c >= t)
        return l.setStart(a, t - o), l.collapse(!0), l;
      o += c;
    } else
      for (let c = a.childNodes.length - 1; c >= 0; c--) n.push(a.childNodes[c]);
  return l.setStart(e, e.childNodes.length), l.collapse(!0), l;
}, T = (e, t, l) => {
  const n = D(t, l);
  e.removeAllRanges(), e.addRange(n);
}, C = (e, t) => {
  const l = e.getRangeAt(0), n = l.cloneRange();
  return n.selectNodeContents(t), n.setEnd(l.endContainer, l.endOffset), n.toString().length;
}, I = (e) => {
  const t = g(0);
  R(() => {
    const a = (o) => {
      o.key === "ArrowUp" ? (o.preventDefault(), t.value = t.value > 0 ? t.value - 1 : 0) : o.key === "ArrowDown" ? (o.preventDefault(), t.value = t.value < e.options.value.length - 1 ? t.value + 1 : t.value) : (o.key === "Tab" || o.key === "Enter") && (o.preventDefault(), e.onSelect(e.options.value[t.value]));
    };
    return document.addEventListener("keydown", a), () => document.removeEventListener("keydown", a);
  }, []);
  const l = p(null), n = (a) => (l.current?.children[a].scrollIntoView({ behavior: "smooth" }), "bubble-search__hintbox__list__item--active");
  return /* @__PURE__ */ s("div", { ref: l, class: "bubble-search__hintbox__list", children: e.options.value.map((a, o) => /* @__PURE__ */ s("div", { onMouseOver: () => t.value = o, class: `bubble-search__hintbox__list__item ${o === t.value ? n(o) : ""}`, onClick: (c) => {
    c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), e.onSelect(a);
  }, children: /* @__PURE__ */ s(e.item, { ...a }) })) });
}, S = (e) => {
  const t = p(null), l = g(), n = g(), a = g(""), o = p(null), c = m(
    () => n.value ? e.hints[n.value] : void 0
  );
  return R(() => void t.current?.dispatchEvent(new Event("input")), []), /* @__PURE__ */ s("div", { class: "bubble-search", children: [
    /* @__PURE__ */ s("div", { ref: t, class: "bubble-search__textbox", contenteditable: !0, spellcheck: !1, onInput: (u) => {
      let _ = {}, y = u.currentTarget.innerText.replace(/(^|\s)([^\s]+):([^\s]*)/g, (f, x, b, v) => Object.keys(e.hints).includes(b) ? (e.hints[b].deserialize(v) && (b in _ ? _[b].push(v) : _[b] = [v]), `<span class="bubble-search__textbox__bubble-space">${x}</span><span class="bubble-search__textbox__bubble"><span class="bubble-search__textbox__bubble__key">${b}<span class="bubble-search__textbox__bubble-colon">:</span></span><span class="bubble-search__textbox__bubble__value">${v}</span></span>`) : f.replace(
        /^(\s*)([^\s]+)(\s*)$/,
        (A, w, H, k) => `${" ".repeat(w.length)}<span class="bubble-search__textbox__bubble--invalid" data-error="Unknown property '${b}'">${H}</span>${" ".repeat(k.length)}`
      )).replace(/\u00A0([^\s<>])/g, " $1").replace(/(<\/span>)\s*$/, "$1 ");
      const h = document.getSelection(), $ = h.rangeCount && C(h, u.currentTarget);
      u.currentTarget.innerHTML = y, h.rangeCount && T(h, u.currentTarget, $);
      const i = h.anchorNode?.parentElement;
      let d;
      if (i && (o.current = i, i.className === "bubble-search__textbox__bubble-colon" ? (n.value = i.parentElement.childNodes[0].textContent, a.value = "", d = i.parentElement.parentElement) : i.className === "bubble-search__textbox__bubble__value" ? (n.value = i.parentElement.childNodes[0].childNodes[0].textContent, a.value = i.textContent, d = i.parentElement) : (n.value = void 0, a.value = "")), d && t.current) {
        const f = d.getBoundingClientRect(), x = t.current.getBoundingClientRect(), b = f.x - x.x, v = f.y - x.y;
        l.value = { x: b, y: v };
      } else
        l.value = void 0;
      _.rowText = y.replace(/<[^>]*>/g, ""), e.onInput(_);
    } }),
    /* @__PURE__ */ s(O, { textboxRef: t, anchor: o, position: l, hint: c, closeHint: () => n.value = void 0, partialValue: a })
  ] });
}, O = (e) => {
  if (!e.hint.value) return null;
  const t = m(() => !e.hint.value || e.hint.value.type === "custom" ? [] : e.hint.value.getOptions(e.partialValue.value)), l = m(
    () => e.position.value && `transform: translate(${e.position.value.x}px, 10px)`
    // `transform: translate(${props.position.value.x}px, ${props.position.value.y}px)`
  );
  return /* @__PURE__ */ s("div", { class: "bubble-search__hintbox", style: l, children: e.hint.value.type === "custom" ? /* @__PURE__ */ s(
    e.hint.value.component,
    {
      value: e.partialValue,
      onSelect: (n) => {
        e.hint.value && e.hint.value.type === "custom" && (N({
          currentBubbleAnchor: e.anchor,
          textInputAnchor: e.textboxRef,
          rowValue: e.hint.value.format(n)
        }), e.closeHint());
      }
    }
  ) : /* @__PURE__ */ s(I, { item: e.hint.value.item, options: t, onSelect: (n) => {
    e.hint.value && e.hint.value.type === "list" && N({
      currentBubbleAnchor: e.anchor,
      textInputAnchor: e.textboxRef,
      rowValue: e.hint.value.format(n)
    }), e.closeHint();
  } }) });
}, N = ({ currentBubbleAnchor: e, textInputAnchor: t, rowValue: l }) => {
  if (e.current) {
    let n;
    if (e.current.classList.contains("bubble-search__textbox__bubble__value") ? n = e.current : e.current.classList.contains("bubble-search__textbox__bubble-colon") && (n = e.current.parentElement?.nextElementSibling), !n) return;
    const a = document.getSelection(), o = a.rangeCount && C(a, t.current), c = n.innerHTML.length;
    n.innerHTML = l, a.rangeCount && T(a, t.current, o + l.length - c + 1);
    const r = new Event("input");
    t.current?.dispatchEvent(r);
  }
};
S.mount = (e, t) => L(/* @__PURE__ */ s(S, { ...t }), document.querySelector(e));
export {
  S as BubblesSearch
};
//# sourceMappingURL=index.js.map
