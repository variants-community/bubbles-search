import { options as y, render as L } from "preact";
import { useSignal as x, useComputed as p } from "@preact/signals";
import { useRef as E, useEffect as N } from "preact/hooks";
var k = 0;
function b(e, t, l, n, a, c) {
  t || (t = {});
  var o, r, u = t;
  if ("ref" in u) for (r in u = {}, t) r == "ref" ? o = t[r] : u[r] = t[r];
  var s = { type: e, props: u, key: l, ref: o, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --k, __i: -1, __u: 0, __source: a, __self: c };
  if (typeof e == "function" && (o = e.defaultProps)) for (r in o) u[r] === void 0 && (u[r] = o[r]);
  return y.vnode && y.vnode(s), s;
}
const A = (e, t) => {
  const l = document.createRange();
  l.selectNode(e);
  const n = [e];
  let a, c = 0;
  for (; a = n.pop(); )
    if (a.nodeType === Node.TEXT_NODE) {
      const o = a.textContent.length;
      if (c + o >= t)
        return l.setStart(a, t - c), l.collapse(!0), l;
      c += o;
    } else
      for (let o = a.childNodes.length - 1; o >= 0; o--) n.push(a.childNodes[o]);
  return l.setStart(e, e.childNodes.length), l.collapse(!0), l;
}, R = (e, t, l) => {
  const n = A(t, l);
  e.removeAllRanges(), e.addRange(n);
}, C = (e, t) => {
  const l = e.getRangeAt(0), n = l.cloneRange();
  return n.selectNodeContents(t), n.setEnd(l.endContainer, l.endOffset), n.toString().length;
}, V = (e) => {
  const t = x(0);
  return N(() => {
    const l = (n) => {
      n.key === "ArrowUp" ? (n.preventDefault(), console.log("up ", t.value), t.value = t.value > 0 ? t.value - 1 : 0) : n.key === "ArrowDown" ? (n.preventDefault(), console.log("down ", t.value), t.value = t.value < e.options.value.length - 1 ? t.value + 1 : t.value) : (n.key === "Tab" || n.key === "Enter") && (n.preventDefault(), e.onSelect(e.options.value[t.value]));
    };
    return document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l);
  }, []), /* @__PURE__ */ b("div", { class: "bubble-search__hintbox__list", children: e.options.value.map((l, n) => /* @__PURE__ */ b("div", { onMouseOver: () => t.value = n, class: `bubble-search__hintbox__list__item ${n === t.value ? "bubble-search__hintbox__list__item--active" : ""}`, onClick: (a) => {
    a.preventDefault(), a.stopPropagation(), a.stopImmediatePropagation(), e.onSelect(l);
  }, children: /* @__PURE__ */ b(e.item, { ...l }) })) });
}, S = (e) => {
  const t = E(null), l = x(), n = x(), a = x(""), c = E(null), o = p(
    () => n.value ? e.hints[n.value] : void 0
  );
  return N(() => void t.current?.dispatchEvent(new Event("input")), []), /* @__PURE__ */ b("div", { class: "bubble-search", children: [
    /* @__PURE__ */ b("div", { ref: t, class: "bubble-search__textbox", contenteditable: !0, spellcheck: !1, onInput: (u) => {
      let s = {}, d = u.currentTarget.innerText.replace(/(^|\s)([^\s]+):([^\s]*)/g, (f, m, i, v) => Object.keys(e.hints).includes(i) ? (console.log("k: ", i), console.log("v: ", v), e.hints[i].deserialize(v) && (i in s ? s[i].push(v) : s[i] = [v]), `<span class="bubble-search__textbox__bubble-space">${m}</span><span class="bubble-search__textbox__bubble"><span class="bubble-search__textbox__bubble__key">${i}<span class="bubble-search__textbox__bubble-colon">:</span></span><span class="bubble-search__textbox__bubble__value">${v}</span></span>`) : f.replace(
        /^(\s*)([^\s]+)(\s*)$/,
        (I, $, w, H) => `${" ".repeat($.length)}<span class="bubble-search__textbox__bubble--invalid" data-error="Unknown property '${i}'">${w}</span>${" ".repeat(H.length)}`
      )).replace(/\u00A0([^\s<>])/g, " $1").replace(/(<\/span>)\s*$/, "$1 ");
      const h = document.getSelection(), T = h.rangeCount && C(h, u.currentTarget);
      u.currentTarget.innerHTML = d, h.rangeCount && R(h, u.currentTarget, T);
      const _ = h.anchorNode?.parentElement;
      let g;
      if (_ && (c.current = _, _.className === "bubble-search__textbox__bubble-colon" ? (n.value = _.parentElement.childNodes[0].textContent, a.value = "", g = _.parentElement.parentElement) : _.className === "bubble-search__textbox__bubble__value" ? (n.value = _.parentElement.childNodes[0].childNodes[0].textContent, a.value = _.textContent, g = _.parentElement) : (n.value = void 0, a.value = "")), g && t.current) {
        const f = g.getBoundingClientRect(), m = t.current.getBoundingClientRect(), i = f.x - m.x, v = f.y - m.y;
        l.value = { x: i, y: v };
      } else
        l.value = void 0;
      s.rowText = d.replace(/<[^>]*>/g, ""), e.onInput(s);
    }, children: "Hello! My name:Artur" }),
    /* @__PURE__ */ b(D, { textboxRef: t, anchor: c, position: l, hint: o, closeHint: () => n.value = void 0, partialValue: a })
  ] });
}, D = (e) => {
  if (!e.hint.value) return null;
  const t = p(() => !e.hint.value || e.hint.value.type === "custom" ? [] : e.hint.value.getOptions(e.partialValue.value)), l = p(
    () => e.position.value && `transform: translate(${e.position.value.x}px, 10px)`
    // `transform: translate(${props.position.value.x}px, ${props.position.value.y}px)`
  );
  return /* @__PURE__ */ b("div", { class: "bubble-search__hintbox", style: l, children: e.hint.value.type === "custom" ? /* @__PURE__ */ b(
    e.hint.value.component,
    {
      value: e.partialValue,
      onSelect: (n) => {
        console.log(n);
      }
    }
  ) : /* @__PURE__ */ b(V, { item: e.hint.value.item, options: t, onSelect: (n) => {
    if (e.hint.value && e.hint.value.type === "list") {
      const a = e.hint.value.format(n);
      if (e.anchor.current) {
        let c;
        if (e.anchor.current.classList.contains("bubble-search__textbox__bubble__value") ? c = e.anchor.current : e.anchor.current.classList.contains("bubble-search__textbox__bubble-colon") && (c = e.anchor.current.parentElement?.nextElementSibling), console.log("value span: ", c), !c) return;
        const o = document.createAttribute("data-item");
        o.value = JSON.stringify(n), c.attributes.setNamedItem(o);
        const r = document.getSelection(), u = r.rangeCount && C(r, e.textboxRef.current), s = c.innerHTML.length;
        c.innerHTML = a, r.rangeCount && R(r, e.textboxRef.current, u + a.length - s + 1), e.closeHint();
        const d = new Event("input");
        e.textboxRef.current?.dispatchEvent(d);
      }
    }
    console.log("anchor: ", e.anchor), console.log("selected: ", n);
  } }) });
};
S.mount = (e, t) => L(/* @__PURE__ */ b(S, { ...t }), document.querySelector(e));
export {
  S as BubblesSearch
};
//# sourceMappingURL=index.js.map
