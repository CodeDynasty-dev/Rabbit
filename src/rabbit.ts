import { throttle } from "./tools";
import redo from "./icons/redo.png";
import undo from "./icons/undo.png";
import { css } from "./css";
import { me } from "./tools";
import { ACTION_TYPES, BEHAVIOR_TYPES, SyntheticAction } from "./types";

export class Rabbit {
  _el: HTMLElement | undefined;
  _Mel: HTMLElement | undefined;
  _doStack: string[] = [];
  _do_index: number = 0;
  _STACK_SIZE: number = 1000;
  _STACKING_TIME: number = 4;
  _toolsList: Record<string, any> = {};
  _modalList: Record<string, ((data: any) => HTMLDivElement)[]> = {};
  _syntheticActionList: Record<string, any> = {};
  selection: string | null = null;
  selectedElement: HTMLParagraphElement | null = null;
  range: Range | null = null;
  _actionList: Record<ACTION_TYPES, ((e: any) => void)[]> = {
    input: [],
    paste: [],
    focus: [],
    copy: [],
    click: [],
    contextmenu: [],
    "document-selectionchange": [],
  };
  constructor({
    STACK_SIZE,
    STACKING_TIME,
  }: { STACK_SIZE?: number; STACKING_TIME?: number } = {}) {
    if (STACK_SIZE) {
      this._STACK_SIZE = STACK_SIZE;
    }
    if (STACKING_TIME) {
      this._STACKING_TIME = STACKING_TIME;
    }
  }
  installOn(id: string = "pub", html?: string) {
    const el = document.getElementById(id);
    if (!el) {
      throw new Error(`Element with id "${id}" not found`);
    }
    // console.log(el);

    if (window.outerWidth < 601) {
      el.className = "rabbit-editor-container mobile";
    } else {
      el.className = "rabbit-editor-container";
    }
    // console.log(window.outerWidth < 600, el);
    css();
    el!.contentEditable = "true";
    if (html) {
      el!.innerHTML = html;
    } else {
      el!.innerHTML = "<p>Start Typing .... </p>";
    }
    this._el = el;
    this._createDefaultTools();
    this._createDefaultActions();
    this._installTools();
    this._ActivateActions();
    this._el!.focus();
  }

  installTool(
    name: BEHAVIOR_TYPES,
    tool: {
      text?: string;
      tooling: (context: {
        selection: string | null;
        range: Range | null;
        selectedElement: HTMLParagraphElement | null;
      }) => void;
      image?: string;
      html?: HTMLDivElement;
    }
  ) {
    //! checking type
    this._toolsList[name] = tool;
  }
  installAction(type: ACTION_TYPES, action: (e: any) => void) {
    //! checking type
    if (this._actionList[type]) {
      this._actionList[type].push(action);
    } else {
      this._actionList[type] = [action];
    }
  }
  installModalTool(call: string, html: ((data: any) => HTMLDivElement)[]) {
    this._modalList[call] = html;
  }

  showModal(call: string, data: unknown = null) {
    if (!this._Mel || !Array.isArray(this._modalList[call])) {
      return;
    }
    this._Mel.innerHTML = "";
    const h = this._modalList[call][0](data);
    if (h) {
      this._Mel.appendChild(h);
      this._Mel.classList.remove("in-active");
      this._Mel.classList.add("active");
    }
  }
  navigateModal(call: string, index: number, data: unknown) {
    if (!this._Mel || !Array.isArray(this._modalList[call])) {
      return;
    }
    this._Mel.innerHTML = "";
    const h = this._modalList[call][index](data);
    if (h) {
      this._Mel.appendChild(h);
      this._Mel.classList.remove("in-active");
      this._Mel.classList.add("active");
    }
  }

  hideModal() {
    if (!this._Mel) {
      return;
    }
    this._Mel.classList.remove("active");
    this._Mel.classList.add("in-active");
  }
  fireSyntheticAction(type: SyntheticAction) {
    // @ts-ignore
    this._syntheticActionList[type]?.call();
  }
  _createDefaultActions() {
    // auto format
    const autoformat = async () => {
      const selection = window.getSelection()!;
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const node = range.startContainer as HTMLElement;
        const par = node.parentNode as HTMLElement;
        if (par.nodeName !== "P" && node.textContent?.trim()) {
          if (par!.id !== "pub" && node.id !== "pub") {
            const pElement = document.createElement("p");
            pElement.textContent = node.textContent;
            par!.insertAdjacentElement("afterend", pElement);
            par!.remove();
            range.deleteContents();
            range.insertNode(pElement);
            selection.removeRange(range);
          }
        } else {
          if (node.nodeName === "IMG") {
            par.removeChild(node);
            par!.insertAdjacentElement("afterend", node);
            console.log(node, par);
          }
        }
      }
    };
    // auto get selection content
    const getSelection = async () => {
      const select = window.getSelection()!;
      if (select.rangeCount > 0) {
        const range = select.getRangeAt(0);
        const node = range.startContainer;
        const lineText = node.textContent || "";
        if (lineText && node.parentNode?.nodeName === "P") {
          this.selection = range.toString() as unknown as string;
          // this.selection = lineText as unknown as string;
          this.selectedElement =
            node.parentNode as unknown as HTMLParagraphElement;
          this.range = range as typeof range;
        } else {
          if (lineText && node.parentNode?.nodeName === "SPAN") {
            this.selectedElement =
              node.parentNode as unknown as HTMLParagraphElement;
          }
        }
      }
    };

    const active = async (e: any) => {
      const element = e.target as HTMLParagraphElement;
      if (element.tagName === "P") {
        this.selectedElement = element;
        if (!element.innerText.trim()) {
          element.removeAttribute("style");
        }
      }
    };
    document.addEventListener("keydown", async (ke) => {
      if (/(ArrowUp|ArrowDown|Enter)/.test(ke.key)) {
        const select = window.getSelection()!;
        if (select.rangeCount > 0) {
          const range = select.getRangeAt(0);
          const node = range.startContainer;
          if (node.parentNode?.nodeName === "P") {
            this.selectedElement =
              node.parentNode as unknown as HTMLParagraphElement;
            this.range = range as typeof range;
            // console.log(this.selectedElement);
            if (!this.selectedElement.innerText.trim()) {
              this.selectedElement.removeAttribute("style");
            }
          }
        }
      } else {
        if (ke.key === "Esc" || ke.key === "Escape") {
          this.hideModal();
        }
      }
    });
    // auto save
    const auto_save_throttler = throttle(async () => {
      this._saveState();
    }, this._STACKING_TIME);

    this._actionList["input"].push(auto_save_throttler, autoformat);
    this._actionList["focus"].push(auto_save_throttler, autoformat);
    this._actionList["document-selectionchange"].push(getSelection);
    this._actionList["click"].push(active);
  }
  _createDefaultTools() {
    const ins = this;
    this._toolsList["redo"] = {
      image: redo,
      tooling() {
        ins._redo();
      },
    };
    this._toolsList["undo"] = {
      image: undo,
      tooling() {
        ins._undo();
      },
    };
  }
  _installTools() {
    const toolContainer = document.createElement("div");
    const modal = document.createElement("div");

    if (window.outerWidth < 601) {
      toolContainer.className = "rabbit-tool-container mobile";
      modal.className = "rabbit-modal mobile";
    } else {
      toolContainer.className = "rabbit-tool-container";
      modal.className = "rabbit-modal";
    }
    for (const command in this._toolsList) {
      let l: HTMLElement | null = null;
      if (this._toolsList[command].image) {
        l = me("img", {
          src: this._toolsList[command].image,
          className: "rabbit-tool",
        });
      }
      if (this._toolsList[command].text) {
        l = me(
          "button",
          {
            className: "rabbit-tool",
          },
          this._toolsList[command].text
        );
      }
      if (this._toolsList[command].html) {
        this._toolsList[command].html.className = "rabbit-tool";
        l = this._toolsList[command].html;
      }
      l!.addEventListener("click", () => this._apply(command));
      l!.title = command;
      toolContainer.appendChild(l!);
    }
    toolContainer.appendChild(modal);
    this._Mel = modal;
    this._el!.parentElement?.appendChild(toolContainer);
  }

  async _apply(command: string) {
    const fn = this._toolsList[command].tooling;
    fn({
      selectedElement: this.selectedElement,
      selection: this.selection,
      range: this.range,
    });
    this._el!.focus();
  }
  // Method for saving editor state
  _saveState() {
    if (this._doStack.length > this._STACK_SIZE) {
      this._doStack.length = this._STACK_SIZE;
    }
    const content = this._el!.innerHTML;
    // @ts-ignore
    if (content !== this._doStack.at(-1)) {
      this._doStack.push(content);
      this._do_index = this._doStack.length - 1;
    }
  }

  _undo() {
    if (this._do_index > 0) {
      this._do_index -= 1;
      const previousState = this._doStack.at(this._do_index);
      if (previousState) {
        this._el!.innerHTML = previousState;
      }
    }
  }
  _redo() {
    if (this._do_index < this._doStack.length - 1) {
      this._do_index += 1;
      const nextState = this._doStack.at(this._do_index);
      if (nextState) {
        this._el!.innerHTML = nextState;
      }
    }
  }
  _ActivateActions() {
    for (const [type, actions] of Object.entries(this._actionList)) {
      for (let i = 0; i < actions.length; i++) {
        if (type.includes("document-")) {
          document.addEventListener(type.split("document-")[1], actions[i]);
        } else if (type.includes("synthetic-")) {
          this._syntheticActionList[type] = actions[i];
        } else {
          this._el!.addEventListener(type, actions[i]);
        }
      }
    }
  }
}
