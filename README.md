<br/>
<p align="center">
  <a href="https://codedynasty-dev.github.io/Rabbit/">
<img src="https://github.com/CodeDynasty-dev/Rabbit/raw/main/src/rabbit.png" width='200' >
</img>
  </a>

  <h1 align="center">Rabbit.js</h1>

  <p align="center">
A bare bone Text Editor library for javascript
Aimed to be small, simple, efficient and easy to extend.
    <br/>
    <br/>
    <a href="https://fridaycandour.github.io/Rabbit/index.html" align="center">
    Live Example
    </a>
    <br/> 
    <br/>
 <div align="center">
    .
    <a href="https://github.com/fridaycandour/cradova/issues">Report Bug</a>
    .
    <a href="https://github.com/fridaycandour/cradova/issues">Request Feature</a>
</div>
  </p>
</p>
 
Example Rabbit setup

```js
import { Rabbit } from "./rabbit.js";

// creating a Rabbit instance

const BigFatRabbit = new Rabbit();

BigFatRabbit.installOn("pub"); // #pub div install point
```

Now you will get a working text editor, which comes with default actions and tools.

## Features of Rabbit

Rabbit big has ears, two big tooths, huh no sorry. i mean

- Strong Type system (typescript)
- Simple abstraction interface for
  - actions (event system)
  - tools (user input system)

which makes rabbit very easy to extend

- and other part of rabbits ...

next

Example ways of extending Rabbit

in Rabbit we can install tools and actions
more docs will be added later

```js

// Extending Rabbit.js


BigFatRabbit.installTool("Bold", {
  text: "Bold Button",
  tooling({ selectedElement, selection, range }) {
    console.log(selection, selectedElement);
    if (selectedElement) {
      if (selection) {
        if (selection === selectedElement.innerText) {
          if (selectedElement?.style.fontWeight === "bold") {
            selectedElement!.style.fontWeight = "unset";
          } else {
            selectedElement!.style.fontWeight = "bold";
          }
        } else {
          const span = document.createElement("span");
          span.innerText = selection;
          span.style.fontWeight = "bold";
          range!.deleteContents();
          range!.insertNode(span);
        }
      }
    }
  },
});

BigFatRabbit.installTool("Color", {
  text: "Color Button",
  tooling({ selectedElement, selection, range }) {
    console.log(selection, selectedElement);
    const input = document.createElement("input");
    input.type = "color";
    input.addEventListener("change", (e) => {
      const color = (e.target! as HTMLInputElement).value;
      if (selectedElement) {
        if (selection) {
          if (selection === selectedElement.innerText) {
            if (selectedElement?.style.color === color) {
              selectedElement!.style.color = "unset";
            } else {
              selectedElement!.style.color = color;
            }
          } else {
            const span = document.createElement("span");
            span.innerText = selection;
            span.style.color = color;
            range!.deleteContents();
            range!.insertNode(span);
          }
        }
      }
    });
    input.click();
  },
});

BigFatRabbit.installTool("Image", {
  text: "Inset image",
  tooling({ selectedElement, selection, range }) {
    console.log(selection, selectedElement);
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.addEventListener("change", (e) => {
      const file = (e.target! as any).files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target!.result as string;
          range!.insertNode(img);
        };
        reader.readAsDataURL(file);
      }
    });
    input.click();
  },
});

BigFatRabbit.installTool("Link", {
  text: "Inset link",
  tooling({ selectedElement, selection, range }) {
    console.log(selection, selectedElement);
    const url = prompt("Enter URL:");
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.textContent = selection;
      range!.deleteContents();
      range!.insertNode(link);
    }
  },
});

BigFatRabbit.installTool("Alignment", {
  text: "center Alignment",
  tooling({ selectedElement, selection, range }) {
    console.log(selection, selectedElement);
    if (selection) {
      const alignedContainer = document.createElement("div");
      alignedContainer.style.textAlign = "center";
      alignedContainer.appendChild(range!.extractContents());
      range!.insertNode(alignedContainer);
    }
  },
});

BigFatRabbit.installAction("paste", (e: any) => {
  e.preventDefault();
  const clipboardData =
    e.clipboardData ||
    (window as unknown as { clipboardData: object }).clipboardData;
  const pastedText = clipboardData.getData("text/plain");
  document.execCommand("insertHTML", false, pastedText);
});

BigFatRabbit.installOn("pub");


// synthetic actions

// actions are attach to their editor,the document object model or fired synthetically
BigFatRabbit.installAction("synthetic-grass", () => {
  console.log("grass");
});

// tool appears as a button on the toolbar
BigFatRabbit.installTool("custom", {
  text: "grass",
  tooling() {
    BigFatRabbit.fireSyntheticAction("synthetic-grass");
  },
});
```

ACTION TYPES includes

- "input"
- "paste"
- "copy"
- "contextmenu"
- "document-event name"
- "custom synthetic actions"

# Rabbit is MIT
