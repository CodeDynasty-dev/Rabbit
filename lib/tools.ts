// really simple thing to do
export const throttle = (
  cb: { (): void; (arg0: any): void },
  time: number | undefined
) => {
  let debID: number | undefined;
  return (...args: any) => {
    if (debID) {
      clearTimeout(debID);
    }
    debID = setTimeout(() => {
      // @ts-ignore
      cb(...args);
    }, time);
  };
};

type DataAttributes = { [key: `data-${string}`]: string };
type AriaAttributes = { [key: `aria-${string}`]: string };

type Attr<T> =
  | {
      style?: Partial<CSSStyleDeclaration>;
      ref: El_ref;
    }
  | Partial<T>
  | Partial<DataAttributes>
  | Partial<AriaAttributes>;

export const me = <T = HTMLElement>(
  tag: string,
  attrs?: Attr<T>,
  ...chils: HTMLElement[] | string[]
) => {
  const ele = document.createElement(tag);

  for (const attr in attrs) {
    if (typeof attrs === "string") {
      ele.innerText = attrs;
      break;
    }
    if (attrs instanceof HTMLElement) {
      ele.appendChild(attrs);
      break;
    }
    if (Array.isArray(attrs[attr as keyof Attr<unknown>])) {
      const ref = attrs[attr as keyof Attr<unknown>] as any;
      if (ref[0] instanceof El_ref) {
        ref[0].dom[ref[1]] = ele;
      }
      continue;
    }
    if (attr === "style") {
      // @ts-ignore
      Object.assign(ele.style, attrs[attr]);
      continue;
    }
    // @ts-ignore
    ele[attr] = attrs[attr as keyof Attr];
  }

  for (let i = 0; i < chils.length; i++) {
    const chil = chils[i];
    if (chil instanceof HTMLElement) {
      ele.appendChild(chil);
    }
    if (typeof chil === "string") {
      ele.innerText = chil;
    }
  }
  return ele as any;
};

export const u = <E>(q: string) => document.querySelector(q) as E;
export class El_ref {
  dom: Record<string, HTMLElement | undefined> = {};
  setAs(name: string) {
    return [this, name] as unknown as this;
  }
  E<T = HTMLElement>(name: string) {
    return this.dom[name] as T | undefined;
  }
}
