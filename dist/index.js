import { options as E, render as L } from "preact";
import { useSignal as g, useComputed as m } from "@preact/signals";
import { useRef as p, useEffect as R } from "preact/hooks";
var V = 0;
function s(e, t, n, l, a, o) {
  t || (t = {});
  var r, c, u = t;
  if ("ref" in u) for (c in u = {}, t) c == "ref" ? r = t[c] : u[c] = t[c];
  var _ = { type: e, props: u, key: n, ref: r, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --V, __i: -1, __u: 0, __source: a, __self: o };
  if (typeof e == "function" && (r = e.defaultProps)) for (c in r) u[c] === void 0 && (u[c] = r[c]);
  return E.vnode && E.vnode(_), _;
}
const D = (e, t) => {
  const n = document.createRange();
  n.selectNode(e);
  const l = [e];
  let a, o = 0;
  for (; a = l.pop(); )
    if (a.nodeType === Node.TEXT_NODE) {
      const r = a.textContent.length;
      if (o + r >= t)
        return n.setStart(a, t - o), n.collapse(!0), n;
      o += r;
    } else
      for (let r = a.childNodes.length - 1; r >= 0; r--) l.push(a.childNodes[r]);
  return n.setStart(e, e.childNodes.length), n.collapse(!0), n;
}, T = (e, t, n) => {
  const l = D(t, n);
  e.removeAllRanges(), e.addRange(l);
}, C = (e, t) => {
  const n = e.getRangeAt(0), l = n.cloneRange();
  return l.selectNodeContents(t), l.setEnd(n.endContainer, n.endOffset), l.toString().length;
}, I = (e) => {
  const t = g(0);
  R(() => {
    const a = (o) => {
      o.key === "ArrowUp" ? (o.preventDefault(), t.value = t.value > 0 ? t.value - 1 : 0) : o.key === "ArrowDown" ? (o.preventDefault(), t.value = t.value < e.options.value.length - 1 ? t.value + 1 : t.value) : (o.key === "Tab" || o.key === "Enter") && (o.preventDefault(), e.onSelect(e.options.value[t.value]));
    };
    return document.addEventListener("keydown", a), () => document.removeEventListener("keydown", a);
  }, []);
  const n = p(null), l = (a) => {
    if (n.current)
      return n.current?.children[a].scrollIntoView({ behavior: "smooth", block: "nearest" }), "bubble-search__hintbox__list__item--active";
  };
  return /* @__PURE__ */ s("div", { ref: n, class: "bubble-search__hintbox__list", children: e.options.value.map((a, o) => /* @__PURE__ */ s("div", { onMouseOver: () => t.value = o, class: `bubble-search__hintbox__list__item ${o === t.value ? l(o) : ""}`, onClick: (r) => {
    r.preventDefault(), r.stopPropagation(), r.stopImmediatePropagation(), e.onSelect(a);
  }, children: /* @__PURE__ */ s(e.item, { ...a }) })) });
}, S = (e) => {
  const t = p(null), n = g(), l = g(), a = g(""), o = p(null), r = m(
    () => l.value ? e.hints[l.value] : void 0
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
      if (i && (o.current = i, i.className === "bubble-search__textbox__bubble-colon" ? (l.value = i.parentElement.childNodes[0].textContent, a.value = "", d = i.parentElement.parentElement) : i.className === "bubble-search__textbox__bubble__value" ? (l.value = i.parentElement.childNodes[0].childNodes[0].textContent, a.value = i.textContent, d = i.parentElement) : (l.value = void 0, a.value = "")), d && t.current) {
        const f = d.getBoundingClientRect(), x = t.current.getBoundingClientRect(), b = f.x - x.x, v = f.y - x.y;
        n.value = { x: b, y: v };
      } else
        n.value = void 0;
      _.rowText = y.replace(/<[^>]*>/g, ""), e.onInput(_);
    } }),
    /* @__PURE__ */ s(O, { textboxRef: t, anchor: o, position: n, hint: r, closeHint: () => l.value = void 0, partialValue: a })
  ] });
}, O = (e) => {
  if (!e.hint.value) return null;
  const t = m(() => !e.hint.value || e.hint.value.type === "custom" ? [] : e.hint.value.getOptions(e.partialValue.value)), n = m(
    () => e.position.value && `transform: translate(${e.position.value.x}px, 10px)`
    // `transform: translate(${props.position.value.x}px, ${props.position.value.y}px)`
  );
  return /* @__PURE__ */ s("div", { class: "bubble-search__hintbox", style: n, children: e.hint.value.type === "custom" ? /* @__PURE__ */ s(
    e.hint.value.component,
    {
      value: e.partialValue,
      onSelect: (l) => {
        e.hint.value && e.hint.value.type === "custom" && (N({
          currentBubbleAnchor: e.anchor,
          textInputAnchor: e.textboxRef,
          rowValue: e.hint.value.format(l)
        }), e.closeHint());
      }
    }
  ) : /* @__PURE__ */ s(I, { item: e.hint.value.item, options: t, onSelect: (l) => {
    e.hint.value && e.hint.value.type === "list" && N({
      currentBubbleAnchor: e.anchor,
      textInputAnchor: e.textboxRef,
      rowValue: e.hint.value.format(l)
    }), e.closeHint();
  } }) });
}, N = ({ currentBubbleAnchor: e, textInputAnchor: t, rowValue: n }) => {
  if (e.current) {
    let l;
    if (e.current.classList.contains("bubble-search__textbox__bubble__value") ? l = e.current : e.current.classList.contains("bubble-search__textbox__bubble-colon") && (l = e.current.parentElement?.nextElementSibling), !l) return;
    const a = document.getSelection(), o = a.rangeCount && C(a, t.current), r = l.innerHTML.length;
    l.innerHTML = n, a.rangeCount && T(a, t.current, o + n.length - r + 1);
    const c = new Event("input");
    t.current?.dispatchEvent(c);
  }
};
S.mount = (e, t) => L(/* @__PURE__ */ s(S, { ...t }), document.querySelector(e));
export {
  S as BubblesSearch
};
//# sourceMappingURL=index.js.map
