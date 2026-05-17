import { throttle } from "./tools";
import redo from "./icons/redo.png";
import undo from "./icons/undo.png";
import { css } from "./css";
import { ACTION_TYPES, BEHAVIOR_TYPES, SyntheticAction } from "./types";

export class Rabbit {
  _el: HTMLElement | undefined;
  _Mel: HTMLElement | undefined;
  _tooltip: HTMLElement | undefined;
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
  _lastSavedIndex: number = -1;
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
    },
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
          }
        }
      }
    };

    const getSelection = async () => {
      const select = window.getSelection()!;
      if (select.rangeCount > 0) {
        const range = select.getRangeAt(0);
        const node = range.startContainer;
        const lineText = node.textContent || "";
        if (lineText && node.parentNode?.nodeName === "P") {
          this.selection = range.toString() as unknown as string;
          this.selectedElement =
            node.parentNode as unknown as HTMLParagraphElement;
          this.range = range as typeof range;
        } else if (lineText && node.parentNode?.nodeName === "SPAN") {
          this.selectedElement =
            node.parentNode as unknown as HTMLParagraphElement;
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
        this._showTooltip(element, e.clientX, e.clientY);
      }
    };

    const handleEnter = async (ke: KeyboardEvent) => {
      if (ke.key === "Enter") {
        const selection = window.getSelection()!;
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const node = range.startContainer;
          if (node.parentNode?.nodeName === "P") {
            const parentP = node.parentNode as HTMLParagraphElement;
            const currentAlign = parentP.style.textAlign;
            if (
              currentAlign === "center" ||
              currentAlign === "right" ||
              currentAlign === "left"
            ) {
              setTimeout(() => {
                const newSelection = window.getSelection();
                if (newSelection && newSelection.rangeCount > 0) {
                  const newRange = newSelection.getRangeAt(0);
                  const newNode = newRange.startContainer;
                  if (newNode.parentNode?.nodeName === "P") {
                    (
                      newNode.parentNode as HTMLParagraphElement
                    ).style.textAlign = "left";
                  }
                }
              }, 0);
            }

            const textContent = parentP.textContent || "";
            const isList = textContent.startsWith("• ");
            const hasContent = textContent.replace("• ", "").trim().length > 0;

            if (isList && hasContent) {
              ke.preventDefault();
              const newP = document.createElement("p");
              newP.innerHTML = "• ";
              parentP.parentNode?.insertBefore(newP, parentP.nextSibling);
              selection.removeAllRanges();
              const newRange = document.createRange();
              newRange.selectNodeContents(newP);
              newRange.collapse(false);
              selection.addRange(newRange);
            }
          }
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
            if (!this.selectedElement.innerText.trim()) {
              this.selectedElement.removeAttribute("style");
            }
          }
        }
      }
      if (ke.key === "Enter") {
        handleEnter(ke);
      } else if (ke.key === "Esc" || ke.key === "Escape") {
        this.hideModal();
        this._hideTooltip();
      }
    });

    this._el?.addEventListener("blur", () => {
      setTimeout(() => {
        if (
          document.activeElement !== this._el &&
          document.activeElement !== this._tooltip &&
          !this._tooltip?.contains(document.activeElement)
        ) {
          this._hideTooltip();
        }
      }, 100);
    });

    document.addEventListener("click", (e) => {
      if (this._tooltip && this._tooltip.style.display !== "none") {
        const target = e.target as HTMLElement;
        if (
          !this._tooltip.contains(target) &&
          !target.closest(".rabbit-tool-container") &&
          target !== this._el &&
          !this._el?.contains(target)
        ) {
          this._hideTooltip();
        }
      }
    });

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
    const tooltip = document.createElement("div");

    tooltip.className = "rabbit-tooltip";
    tooltip.style.display = "none";
    tooltip.style.position = "absolute";
    tooltip.style.zIndex = "1000";

    if (window.outerWidth < 601) {
      toolContainer.className = "rabbit-tool-container mobile";
      modal.className = "rabbit-modal mobile";
    } else {
      toolContainer.className = "rabbit-tool-container";
      modal.className = "rabbit-modal";
    }

    toolContainer.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });

    toolContainer.appendChild(modal);
    this._Mel = modal;
    this._tooltip = tooltip;
    document.body.appendChild(tooltip);
    document.body.appendChild(toolContainer);
  }

  _showTooltip(_element: HTMLElement, x: number, y: number) {
    if (!this._tooltip || !this.selectedElement) return;

    this._tooltip.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "rabbit-tooltip-wrapper";

    const moveBtn = document.createElement("button");
    moveBtn.className = "rabbit-tooltip-icon";
    moveBtn.innerHTML = "⋮⋮";
    moveBtn.title = "Move";

    const plusBtn = document.createElement("button");
    plusBtn.className = "rabbit-tooltip-icon";
    plusBtn.innerHTML = "+";
    plusBtn.title = "Add";

    const divider = document.createElement("div");
    divider.className = "rabbit-tooltip-divider";

    wrapper.appendChild(moveBtn);
    wrapper.appendChild(divider);
    wrapper.appendChild(plusBtn);

    const moveMenu = document.createElement("div");
    moveMenu.className = "rabbit-tooltip-menu rabbit-tooltip-move-menu";

    const isHeader =
      this.selectedElement?.style.fontWeight === "bold" &&
      (this.selectedElement?.style.fontSize?.includes("em") ||
        this.selectedElement?.tagName === "H1" ||
        this.selectedElement?.tagName === "H2" ||
        this.selectedElement?.tagName === "H3" ||
        this.selectedElement?.tagName === "H4" ||
        this.selectedElement?.tagName === "H5" ||
        this.selectedElement?.tagName === "H6");

    if (isHeader) {
      const headerSizes = [
        { level: "1", label: "H1" },
        { level: "2", label: "H2" },
        { level: "3", label: "H3" },
        { level: "4", label: "H4" },
        { level: "5", label: "H5" },
        { level: "6", label: "H6" },
      ];
      const headerMenu = document.createElement("div");
      headerMenu.className =
        "rabbit-tooltip-menu-item rabbit-tooltip-menu-parent";
      headerMenu.innerHTML = "Header size ›";
      const headerSub = document.createElement("div");
      headerSub.className = "rabbit-tooltip-submenu";
      headerSizes.forEach((h) => {
        const item = document.createElement("div");
        item.className = "rabbit-tooltip-submenu-item";
        item.dataset.headerLevel = h.level;
        item.innerHTML = h.label;
        headerSub.appendChild(item);
      });
      headerMenu.appendChild(headerSub);
      moveMenu.appendChild(headerMenu);

      headerSub
        .querySelectorAll(".rabbit-tooltip-submenu-item")
        .forEach((item) => {
          item.addEventListener("click", (e) => {
            const level = (e.target as HTMLElement).dataset.headerLevel;
            const sizes: Record<string, string> = {
              "1": "2em",
              "2": "1.5em",
              "3": "1.25em",
              "4": "1em",
              "5": "0.875em",
              "6": "0.75em",
            };
            this.selectedElement!.style.fontSize = sizes[level!];
            this.selectedElement!.style.fontWeight = "bold";
            this._hideTooltip();
            this._el?.focus();
          });
        });
    }

    const convertTo = document.createElement("div");
    convertTo.className = "rabbit-tooltip-menu-item rabbit-tooltip-menu-parent";
    convertTo.innerHTML = "Convert to ›";
    const convertSub = document.createElement("div");
    convertSub.className = "rabbit-tooltip-submenu";
    convertSub.innerHTML = `
      <div class="rabbit-tooltip-submenu-item" data-type="text">T Text</div>
      <div class="rabbit-tooltip-submenu-item" data-type="heading">H Heading</div>
      <div class="rabbit-tooltip-submenu-item" data-type="list">1 List</div>
      <div class="rabbit-tooltip-submenu-item" data-type="quote">" Quote</div>
    `;
    convertTo.appendChild(convertSub);

    const moveUp = document.createElement("div");
    moveUp.className = "rabbit-tooltip-menu-item";
    moveUp.innerHTML = "^ Move up";

    const moveDown = document.createElement("div");
    moveDown.className = "rabbit-tooltip-menu-item";
    moveDown.innerHTML = "v Move down";

    const deleteItem = document.createElement("div");
    deleteItem.className = "rabbit-tooltip-menu-item rabbit-tooltip-delete";
    deleteItem.innerHTML = "× Delete";

    moveMenu.appendChild(convertTo);
    moveMenu.appendChild(moveUp);
    moveMenu.appendChild(moveDown);
    moveMenu.appendChild(deleteItem);

    const addMenu = document.createElement("div");
    addMenu.className = "rabbit-tooltip-menu rabbit-tooltip-add-menu";

const addItems = [
      { type: "text", label: "Text", icon: "T" },
      { type: "heading", label: "Heading", icon: "H" },
      { type: "list", label: "List", icon: "•" },
      { type: "checklist", label: "Checklist", icon: "☑" },
      { type: "quote", label: "Quote", icon: '"' },
      { type: "code", label: "Code Block", icon: "<>" },
      { type: "delimiter", label: "Delimiter", icon: "—" },
      { type: "table", label: "Table", icon: "▦" },
    ];

    const getActiveState = (type: string): boolean => {
      if (!this.selectedElement) return false;
      const el = this.selectedElement;
      switch (type) {
        case "text":
          return !el.style.fontSize?.includes("em") && el.style.fontWeight !== "bold";
        case "heading":
          return el.style.fontSize?.includes("em") && el.style.fontWeight === "bold";
        case "list":
          return !!el.textContent?.startsWith("• ");
        case "checklist":
          return !!el.querySelector(".rabbit-checklist-container");
        case "quote":
          return !!el.style.borderLeft?.includes("solid");
        case "code":
          return !!el.classList.contains("rabbit-code-block");
        case "delimiter":
          return !!el.classList.contains("ce-delimiter");
        case "table":
          return el.tagName === "TABLE";
        default:
          return false;
      }
    };

    addItems.forEach((item) => {
      const div = document.createElement("div");
      div.className = "rabbit-tooltip-menu-item";
      div.dataset.type = item.type;
      if (getActiveState(item.type)) {
        div.classList.add("active");
      }
      div.innerHTML = `<span class="rabbit-tooltip-icon-left"></span>${item.icon} ${item.label}`;
      addMenu.appendChild(div);
    });

    moveBtn.onclick = (e) => {
      e.stopPropagation();
      addMenu.style.display = "none";
      moveMenu.style.display =
        moveMenu.style.display === "block" ? "none" : "block";
    };

    plusBtn.onclick = (e) => {
      e.stopPropagation();
      moveMenu.style.display = "none";
      addMenu.style.display =
        addMenu.style.display === "block" ? "none" : "block";
    };

    convertTo.onmouseenter = () => {
      convertSub.style.display = "block";
    };
    convertTo.onmouseleave = () => {
      convertSub.style.display = "none";
    };

    convertSub
      .querySelectorAll(".rabbit-tooltip-submenu-item")
      .forEach((item) => {
        item.addEventListener("click", (e) => {
          const type = (e.target as HTMLElement).dataset.type;
          this._handleConvert(type!);
          this._hideTooltip();
          this._el?.focus();
        });
      });

    moveUp.onclick = () => {
      if (this.selectedElement?.previousElementSibling) {
        this.selectedElement.parentNode?.insertBefore(
          this.selectedElement,
          this.selectedElement.previousElementSibling,
        );
      }
      this._hideTooltip();
      this._el?.focus();
    };

    moveDown.onclick = () => {
      if (this.selectedElement?.nextElementSibling) {
        this.selectedElement.parentNode?.insertBefore(
          this.selectedElement.nextElementSibling,
          this.selectedElement,
        );
      }
      this._hideTooltip();
      this._el?.focus();
    };

    deleteItem.onclick = () => {
      this.selectedElement?.remove();
      this._hideTooltip();
      this._el?.focus();
    };

    addMenu.querySelectorAll(".rabbit-tooltip-menu-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const type = (e.currentTarget as HTMLElement).dataset.type;
        this._handleAddBlock(type!);
        this._hideTooltip();
        this._el?.focus();
      });
    });

    const tooltipBody = document.createElement("div");
    tooltipBody.style.position = "relative";
    tooltipBody.appendChild(wrapper);
    tooltipBody.appendChild(moveMenu);
    tooltipBody.appendChild(addMenu);

    this._tooltip.innerHTML = "";
    this._tooltip.appendChild(tooltipBody);
    this._tooltip.style.display = "block";
    this._tooltip.style.top = `${y + 20}px`;
    this._tooltip.style.left = `${x}px`;
  }

  _handleConvert(type: string) {
    if (!this.selectedElement) return;
    switch (type) {
      case "heading":
        this.selectedElement.style.fontSize = "1.5em";
        this.selectedElement.style.fontWeight = "bold";
        break;
      case "list":
        this.selectedElement.innerHTML = "• " + this.selectedElement.innerHTML;
        break;
      case "quote":
        this.selectedElement.style.borderLeft = "3px solid #ccc";
        this.selectedElement.style.paddingLeft = "10px";
        this.selectedElement.style.fontStyle = "italic";
        break;
      case "text":
      default:
        this.selectedElement.style.fontSize = "";
        this.selectedElement.style.fontWeight = "";
        this.selectedElement.style.borderLeft = "";
        this.selectedElement.style.paddingLeft = "";
        this.selectedElement.style.fontStyle = "";
        break;
    }
  }

  _handleAddBlock(type: string) {
    if (!this._el) return;
    let newBlock: HTMLElement = document.createElement("p");
    newBlock.innerHTML = "<br>";
    switch (type) {
      case "heading":
        newBlock.style.fontSize = "1.5em";
        newBlock.style.fontWeight = "bold";
        break;
      case "list":
        newBlock.innerHTML = "• ";
        break;
      case "quote":
        newBlock.style.borderLeft = "3px solid #ccc";
        newBlock.style.paddingLeft = "10px";
        newBlock.style.fontStyle = "italic";
        break;
      case "image":
        newBlock.innerHTML = "[Image placeholder]";
        break;
      case "code":
        newBlock.style.fontFamily = "monospace";
        newBlock.style.background = "#f4f4f4";
        newBlock.style.padding = "8px";
        break;
      case "delimiter":
        newBlock = document.createElement("div");
        newBlock.className = "ce-delimiter cdx-block";
        break;
      case "table": {
        const table = document.createElement("table");
        table.className = "rabbit-table";
        table.contentEditable = "true";

        // Create 3x3 table
        for (let i = 0; i < 3; i++) {
          const row = document.createElement("tr");
          for (let j = 0; j < 3; j++) {
            const cell = document.createElement("td");
            cell.innerHTML = "<br>";
            cell.style.minWidth = "100px";
            cell.style.minHeight = "40px";
            cell.style.padding = "8px";
            cell.style.border = "1px solid #e2e8f0";
            cell.style.cursor = "text";
            row.appendChild(cell);
          }
          table.appendChild(row);
        }
        newBlock = table;
        break;
      }
      case "html":
        newBlock.innerHTML = "<code>&lt;html&gt;</code>";
        break;

      case "checklist": {
        const checkbox = document.createElement("span");
        checkbox.className = "rabbit-checkbox";
        checkbox.innerHTML = "☐";
        checkbox.contentEditable = "false";
        checkbox.style.cursor = "pointer";
        checkbox.style.marginRight = "8px";
        checkbox.style.userSelect = "none";

        checkbox.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (checkbox.innerHTML === "☐") {
            checkbox.innerHTML = "☑";
            checkbox.style.color = "#10b981";
          } else {
            checkbox.innerHTML = "☐";
            checkbox.style.color = "";
          }
        };

        const content = document.createElement("span");
        content.innerHTML = "<br>";
        content.style.flex = "1";

        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.alignItems = "flex-start";
        container.style.gap = "8px";
        container.style.padding = "4px 0";

        container.appendChild(checkbox);
        container.appendChild(content);

        newBlock.innerHTML = "";
        newBlock.appendChild(container);
        newBlock.style.padding = "8px 12px";
        newBlock.style.borderRadius = "6px";
        newBlock.style.background = "rgba(99, 102, 241, 0.04)";
        break;
      }
    }
    this._el.appendChild(newBlock);
    newBlock.scrollIntoView({ behavior: "smooth" });
  }

  _hideTooltip() {
    if (this._tooltip) {
      this._tooltip.style.display = "none";
      this._tooltip.innerHTML = "";
    }
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
        this._lastSavedIndex = this._do_index;
      }
    }
  }
  _redo() {
    if (this._do_index < this._doStack.length - 1) {
      this._do_index += 1;
      const nextState = this._doStack.at(this._do_index);
      if (nextState) {
        this._el!.innerHTML = nextState;
        this._lastSavedIndex = this._do_index;
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
