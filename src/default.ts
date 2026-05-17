import "./tools";
import { Rabbit } from "./rabbit";

const SVG = {
  bold: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>`,
  italic: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>`,
  strike: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>`,
  text: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 4v3h5.5v12h3V7H19V4z"/></svg>`,
  heading: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 4h2v7h6V4h2v16h-2v-7H7v7H5V4z"/></svg>`,
  list: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>`,
  checklist: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z"/></svg>`,
  quote: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>`,
  alignLeft: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>`,
  alignCenter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/></svg>`,
  alignRight: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>`,
  undo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>`,
  redo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
  table: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 2v3H5V5h15zm-5 14h-5v-9h5v9zM5 10h3v9H5v-9zm12 9v-9h3v9h-3z"/></svg>`,
  codeBlock: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
  delimiter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 11h2v2H4v-2zm7-5h2v7h-2V6zm7 5h2v2h-2v-2z"/></svg>`,
};

export const default_RabbitSetup = (Rabbit: Rabbit) => {
  const createToolbar = () => {
    const existing = document.querySelector(".rabbit-toolbar");
    if (existing) existing.remove();

    const toolbar = document.createElement("div");
    toolbar.className = "rabbit-toolbar";

    const createGroup = (tools: { name: string; icon: string; action: () => void }[], label?: string) => {
      const group = document.createElement("div");
      group.className = "rabbit-tool-group";

      const groupLabel = document.createElement("span");
      groupLabel.className = "rabbit-group-label";
      groupLabel.textContent = label || "";
      if (label) group.appendChild(groupLabel);

      tools.forEach(tool => {
        const btn = document.createElement("button");
        btn.className = "rabbit-tool-btn";
        btn.title = tool.name;
        btn.innerHTML = tool.icon;
        btn.dataset.tool = tool.name;
        btn.onclick = (e) => {
          e.preventDefault();
          tool.action();
        };
        group.appendChild(btn);
      });

      return group;
    };

    const formattingGroup = createGroup([
      { name: "Bold", icon: SVG.bold, action: () => applyInlineFormat("bold") },
      { name: "Italic", icon: SVG.italic, action: () => applyInlineFormat("italic") },
      { name: "Strikethrough", icon: SVG.strike, action: () => applyInlineFormat("strike") },
      { name: "Code", icon: SVG.code, action: () => applyInlineFormat("code") },
      { name: "Text", icon: SVG.text, action: () => Rabbit.showModal("text-setting", Rabbit.selectedElement) },
    ], "Format");

    const insertGroup = createGroup([
      { name: "Heading", icon: SVG.heading, action: () => applyBlockFormat("heading") },
      { name: "List", icon: SVG.list, action: () => applyBlockFormat("list") },
      { name: "Checklist", icon: SVG.checklist, action: () => applyBlockFormat("checklist") },
      { name: "Quote", icon: SVG.quote, action: () => applyBlockFormat("quote") },
      { name: "Code Block", icon: SVG.codeBlock, action: () => applyBlockFormat("codeblock") },
      { name: "Delimiter", icon: SVG.delimiter, action: () => applyBlockFormat("delimiter") },
      { name: "Table", icon: SVG.table, action: () => applyBlockFormat("table") },
      { name: "Warning", icon: SVG.warning, action: () => applyBlockFormat("warning") },
    ], "Insert");

    const mediaGroup = createGroup([
      { name: "Image", icon: SVG.image, action: () => insertImage() },
      { name: "Link", icon: SVG.link, action: () => Rabbit.showModal("link", { selection: Rabbit.selection, range: Rabbit.range }) },
    ], "Media");

    const alignGroup = createGroup([
      { name: "Align Left", icon: SVG.alignLeft, action: () => applyBlockFormat("align-left") },
      { name: "Align Center", icon: SVG.alignCenter, action: () => applyBlockFormat("align-center") },
      { name: "Align Right", icon: SVG.alignRight, action: () => applyBlockFormat("align-right") },
    ], "Align");

    const historyGroup = createGroup([
      { name: "Undo", icon: SVG.undo, action: () => Rabbit._undo() },
      { name: "Redo", icon: SVG.redo, action: () => Rabbit._redo() },
    ], "History");

    toolbar.appendChild(formattingGroup);
    toolbar.appendChild(insertGroup);
    toolbar.appendChild(mediaGroup);
    toolbar.appendChild(alignGroup);
    toolbar.appendChild(historyGroup);

    document.body.appendChild(toolbar);
  };

  const applyInlineFormat = (format: string) => {
    if (!Rabbit.selection || !Rabbit.range) return;

    const selection = Rabbit.selection;
    const range = Rabbit.range;

    switch (format) {
      case "bold":
        const bold = document.createElement("strong");
        bold.textContent = selection;
        bold.className = "rabbit-bold";
        range.deleteContents();
        range.insertNode(bold);
        break;
      case "italic":
        const italic = document.createElement("em");
        italic.textContent = selection;
        italic.className = "rabbit-italic";
        range.deleteContents();
        range.insertNode(italic);
        break;
      case "strike":
        const strike = document.createElement("span");
        strike.textContent = selection;
        strike.className = "rabbit-strike";
        strike.style.textDecoration = "line-through";
        range.deleteContents();
        range.insertNode(strike);
        break;
      case "code":
        const code = document.createElement("code");
        code.textContent = selection;
        code.className = "rabbit-code";
        range.deleteContents();
        range.insertNode(code);
        break;
    }
    Rabbit._el?.focus();
  };

  const applyBlockFormat = (format: string) => {
    if (!Rabbit.selectedElement) return;
    const el = Rabbit.selectedElement;

    switch (format) {
      case "heading":
        el.style.fontSize = "1.75em";
        el.style.fontWeight = "700";
        el.style.marginTop = "1em";
        break;
      case "list":
        if (!el.textContent?.startsWith("• ")) {
          el.innerHTML = "• " + el.innerHTML;
        }
        break;
      case "checklist":
        el.innerHTML = "☐ " + el.innerHTML.replace("☐ ", "");
        break;
      case "quote":
        el.style.borderLeft = "4px solid #6366f1";
        el.style.paddingLeft = "20px";
        el.style.marginLeft = "0";
        el.style.fontStyle = "italic";
        el.style.color = "#4b5563";
        break;
      case "codeblock":
        el.style.fontFamily = "'Fira Code', monospace";
        el.style.background = "#f1f5f9";
        el.style.padding = "16px";
        el.style.borderRadius = "8px";
        el.style.overflow = "auto";
        break;
      case "delimiter":
        const del = document.createElement("div");
        del.className = "ce-delimiter cdx-block";
        el.insertAdjacentElement("afterend", del);
        break;
      case "table":
        const table = document.createElement("table");
        table.className = "rabbit-table";
        table.innerHTML = `
          <tr><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td></tr>
        `;
        el.insertAdjacentElement("afterend", table);
        break;
      case "warning":
        el.style.background = "#fef3c7";
        el.style.border = "1px solid #f59e0b";
        el.style.borderRadius = "8px";
        el.style.padding = "16px";
        el.innerHTML = "⚠ " + el.innerHTML;
        break;
      case "align-left":
        el.style.textAlign = "left";
        break;
      case "align-center":
        el.style.textAlign = "center";
        break;
      case "align-right":
        el.style.textAlign = "right";
        break;
    }
    Rabbit._el?.focus();
  };

  const insertImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target?.result as string;
          img.className = "rabbit-inserted-image";
          if (Rabbit.selectedElement) {
            Rabbit.selectedElement.insertAdjacentElement("afterend", img);
          } else {
            Rabbit._el?.appendChild(img);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  Rabbit.installAction("paste", (e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text/plain");
    const file = e.clipboardData?.files?.[0];

    if (file?.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target?.result as string;
        img.className = "rabbit-inserted-image";
        Rabbit._el?.appendChild(img);
      };
      reader.readAsDataURL(file);
    }

    if (text) {
      const p = document.createElement("p");
      p.innerHTML = text.replace(/\n/g, "<br>");
      if (Rabbit.selectedElement) {
        Rabbit.selectedElement.insertAdjacentElement("afterend", p);
      } else {
        Rabbit._el?.appendChild(p);
      }
    }
    Rabbit._el?.focus();
  });

  Rabbit.installAction("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      Rabbit.showModal("image-settings", target);
    }
  });

  const createPopover = (title: string, content: HTMLElement, isWide = false) => {
    const popover = document.createElement("div");
    popover.className = `rabbit-popover ${isWide ? "wide" : ""}`;

    const header = document.createElement("div");
    header.className = "rabbit-popover-header";

    const titleEl = document.createElement("span");
    titleEl.className = "rabbit-popover-title";
    titleEl.textContent = title;

    const closeBtn = document.createElement("button");
    closeBtn.className = "rabbit-popover-close";
    closeBtn.innerHTML = SVG.x;
    closeBtn.onclick = () => Rabbit.hideModal();

    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    popover.appendChild(header);
    popover.appendChild(content);

    return popover;
  };

  Rabbit.installModalTool("link", [() => {
    const content = document.createElement("div");
    content.className = "rabbit-popover-content";

    const input = document.createElement("input");
    input.className = "rabbit-input";
    input.placeholder = "Enter URL...";
    input.id = "rabbit-link-input";

    const btnRow = document.createElement("div");
    btnRow.className = "rabbit-popover-actions";

    const insertBtn = document.createElement("button");
    insertBtn.className = "rabbit-btn-primary";
    insertBtn.textContent = "Insert Link";
    insertBtn.onclick = () => {
      const url = (input as HTMLInputElement).value;
      if (url && Rabbit.range) {
        const a = document.createElement("a");
        a.href = url;
        a.textContent = Rabbit.selection || url;
        a.target = "_blank";
        a.className = "rabbit-link";
        Rabbit.range.deleteContents();
        Rabbit.range.insertNode(a);
      }
      Rabbit.hideModal();
    };

    btnRow.appendChild(insertBtn);
    content.appendChild(input);
    content.appendChild(btnRow);

    return createPopover("Insert Link", content);
  }]);

  Rabbit.installModalTool("image-settings", [(img: HTMLImageElement) => {
    const content = document.createElement("div");
    content.className = "rabbit-popover-content wide";

    const imgPreview = document.createElement("div");
    imgPreview.className = "image-preview";
    imgPreview.appendChild(img.cloneNode(true) as HTMLElement);

    const sizeRow = document.createElement("div");
    sizeRow.className = "setting-row";

    const widthLabel = document.createElement("label");
    widthLabel.textContent = "Width";

    const widthInput = document.createElement("input");
    widthInput.type = "range";
    widthInput.min = "100";
    widthInput.max = "800";
    widthInput.value = img.style.width?.replace("px", "") || "400";

    const widthValue = document.createElement("span");
    widthValue.className = "range-value";
    widthValue.textContent = widthInput.value + "px";

    widthInput.oninput = () => {
      img.style.width = widthInput.value + "px";
      widthValue.textContent = widthInput.value + "px";
    };

    sizeRow.appendChild(widthLabel);
    sizeRow.appendChild(widthInput);
    sizeRow.appendChild(widthValue);

    const alignRow = document.createElement("div");
    alignRow.className = "align-buttons";

    const aligns = [
      { name: "Left", icon: SVG.alignLeft, value: "flex-start" },
      { name: "Center", icon: SVG.alignCenter, value: "center" },
      { name: "Right", icon: SVG.alignRight, value: "flex-end" },
    ];

    aligns.forEach(a => {
      const btn = document.createElement("button");
      btn.className = "align-btn";
      btn.title = a.name;
      btn.innerHTML = a.icon;
      btn.onclick = () => {
        img.style.display = "flex";
        img.style.justifyContent = a.value;
        img.style.width = "100%";
        img.style.maxWidth = "100%";
      };
      alignRow.appendChild(btn);
    });

    const actionsRow = document.createElement("div");
    actionsRow.className = "action-buttons";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
      img.remove();
      Rabbit.hideModal();
    };

    const doneBtn = document.createElement("button");
    doneBtn.className = "rabbit-btn-primary";
    doneBtn.textContent = "Done";
    doneBtn.onclick = () => Rabbit.hideModal();

    actionsRow.appendChild(deleteBtn);
    actionsRow.appendChild(doneBtn);

    content.appendChild(imgPreview);
    content.appendChild(sizeRow);
    content.appendChild(alignRow);
    content.appendChild(actionsRow);

    return createPopover("Image Settings", content, true);
  }]);

  Rabbit.installModalTool("text-setting", [(el: HTMLParagraphElement) => {
    const content = document.createElement("div");
    content.className = "rabbit-popover-content";

    const typeSection = document.createElement("div");
    typeSection.className = "settings-section";

    const typeLabel = document.createElement("label");
    typeLabel.textContent = "Block Type";

    const typeButtons = document.createElement("div");
    typeButtons.className = "button-group";

    const types = [
      { label: "Paragraph", value: "p" },
      { label: "H1", value: "h1" },
      { label: "H2", value: "h2" },
      { label: "H3", value: "h3" },
    ];

    types.forEach(t => {
      const btn = document.createElement("button");
      btn.className = "type-btn";
      btn.textContent = t.label;
      btn.onclick = () => {
        if (t.value === "p") {
          el.style.fontSize = "";
          el.style.fontWeight = "";
        } else {
          const sizes: Record<string, string> = { h1: "2.5em", h2: "2em", h3: "1.5em" };
          el.style.fontSize = sizes[t.value];
          el.style.fontWeight = "700";
        }
      };
      typeButtons.appendChild(btn);
    });

    typeSection.appendChild(typeLabel);
    typeSection.appendChild(typeButtons);

    const inlineSection = document.createElement("div");
    inlineSection.className = "settings-section";

    const inlineLabel = document.createElement("label");
    inlineLabel.textContent = "Inline Style";

    const inlineButtons = document.createElement("div");
    inlineButtons.className = "button-group compact";

    const inlines = [
      { label: "B", style: "fontWeight", value: "bold", icon: "bold" },
      { label: "I", style: "fontStyle", value: "italic", icon: "italic" },
      { label: "U", style: "textDecoration", value: "underline", icon: "none" },
      { label: "S", style: "textDecoration", value: "line-through", icon: "strike" },
    ];

    inlines.forEach(i => {
      const btn = document.createElement("button");
      btn.className = "inline-btn";
      btn.innerHTML = SVG[i.icon as keyof typeof SVG] || i.label;
      btn.onclick = () => {
        const styleProp = i.style as string;
        const current = el.style.getPropertyValue(styleProp);
        if (current === i.value) {
          el.style.removeProperty(styleProp);
          btn.classList.remove("active");
        } else {
          el.style.setProperty(styleProp, i.value);
          btn.classList.add("active");
        }
      };
      inlineButtons.appendChild(btn);
    });

    inlineSection.appendChild(inlineLabel);
    inlineSection.appendChild(inlineButtons);

    const alignSection = document.createElement("div");
    alignSection.className = "settings-section";

    const alignLabel = document.createElement("label");
    alignLabel.textContent = "Alignment";

    const alignButtons = document.createElement("div");
    alignButtons.className = "button-group";

    const aligns = [
      { name: "Left", icon: SVG.alignLeft },
      { name: "Center", icon: SVG.alignCenter },
      { name: "Right", icon: SVG.alignRight },
    ];

    aligns.forEach(a => {
      const btn = document.createElement("button");
      btn.className = "align-btn-small";
      btn.title = a.name;
      btn.innerHTML = a.icon;
      btn.onclick = () => {
        el.style.textAlign = a.name.toLowerCase() as "left" | "center" | "right";
        alignButtons.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      };
      alignButtons.appendChild(btn);
    });

    alignSection.appendChild(alignLabel);
    alignSection.appendChild(alignButtons);

    content.appendChild(typeSection);
    content.appendChild(inlineSection);
    content.appendChild(alignSection);

    return createPopover("Text Settings", content);
  }]);

  createToolbar();
};